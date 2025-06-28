"use server";

import { auth } from "@/auth";
import { parseServerActionResponse } from "@/lib/utils";
import { formSchema, postFormSchema, commentSchema } from "@/lib/validation";
import slugify from "slugify";
import writeClient from "@/sanity/lib/writeClient";
import { client } from "@/sanity/lib/client";

/**
 * Create a new game
 */
export const createGame = async (form: FormData) => {
  try {
    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: "You must be signed in to create a game",
        status: "ERROR",
      });
    }

    // Extract and validate form data
    const formData = Object.fromEntries(
      Array.from(form).filter(([key]) => key !== "pitch")
    );

    // Validate the form data
    const validatedData = formSchema.parse(formData);
    const { title, description, category, image, gameUrl } = validatedData;

    // Generate slug
    const slug = slugify(title, { lower: true, strict: true });

    // Create game document
    const game = {
      title,
      description,
      category,
      image,
      gameUrl,
      slug: {
        _type: "slug",
        current: slug,
      },
      author: {
        _type: "reference",
        _ref: session.id,
      },
      views: 0,
      followers: 0,
    };

    const result = await writeClient.create({ _type: "game", ...game });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error creating game:", error);
    
    if (error instanceof Error) {
      return parseServerActionResponse({
        error: error.message,
        status: "ERROR",
      });
    }

    return parseServerActionResponse({
      error: "An unexpected error occurred",
      status: "ERROR",
    });
  }
};

/**
 * Create a new post
 */
export const createPost = async (form: FormData) => {
  try {
    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: "You must be signed in to create a post",
        status: "ERROR",
      });
    }

    // Extract form data
    const title = form.get("title") as string;
    const content = form.get("content") as string;
    const image = form.get("image") as string;
    const gameId = form.get("game") as string;

    // Validate form data
    const validatedData = postFormSchema.parse({
      title,
      content,
      game: gameId,
      image: image || "",
    });

    // Generate slug
    const slug = slugify(validatedData.title, { lower: true, strict: true });

    // Create post document
    const post = {
      title: validatedData.title,
      content: validatedData.content,
      image: validatedData.image || undefined,
      slug: {
        _type: "slug",
        current: slug,
      },
      game: {
        _type: "reference",
        _ref: validatedData.game,
      },
      author: {
        _type: "reference",
        _ref: session.id,
      },
      createdAt: new Date().toISOString(),
    };

    const result = await writeClient.create({ _type: "post", ...post });

    return parseServerActionResponse({
      ...result,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error creating post:", error);
    
    if (error instanceof Error) {
      return parseServerActionResponse({
        error: error.message,
        status: "ERROR",
      });
    }

    return parseServerActionResponse({
      error: "An unexpected error occurred",
      status: "ERROR",
    });
  }
};

/**
 * Get user's games
 */
export const getUserGames = async () => {
  try {
    const session = await auth();

    if (!session) {
      return parseServerActionResponse({
        error: "You must be signed in to view your games",
        status: "ERROR",
      });
    }

    const games = await client.fetch(`
      *[_type == "game" && author._ref == $userId] | order(_createdAt desc) {
        _id,
        title,
        category,
        _createdAt
      }
    `, { userId: session.id });

    return parseServerActionResponse({
      games,
      error: "",
      status: "SUCCESS",
    });
  } catch (error) {
    console.error("Error fetching user games:", error);
    
    return parseServerActionResponse({
      error: "Failed to fetch your games",
      status: "ERROR",
    });
  }
};

/**
 * Test token permissions (for debugging)
 */
export const testTokenPermissions = async (form: FormData) => {
  try {
    // Test read permissions
    const testResult = await client.fetch(`*[_type == "post"][0] { _id, title }`);
    console.log("Read test successful:", testResult);
    
    // Test write permissions
    const writeTest = await writeClient.create({
      _type: "test",
      title: "Token Test",
      timestamp: new Date().toISOString()
    });
    console.log("Write test successful:", writeTest);
    
    // Clean up test document
    await writeClient.delete(writeTest._id);
    console.log("Delete test successful");
    
    return { success: true };
  } catch (error) {
    console.error("Token test failed:", error);
    return { success: false, error };
  }
};

/**
 * Add a comment to a post
 */
export const addComment = async (form: FormData) => {
  console.log("=== ADD COMMENT FUNCTION CALLED ===");
  
  try {
    const session = await auth();
    
    if (!session) {
      return { status: "ERROR", error: "You must be signed in to comment" };
    }

    const comment = form.get("comment") as string;
    const postId = form.get("postId") as string;

    console.log("Adding comment:", { comment, postId, userEmail: session.user.email });

    // Validate comment data
    const validatedData = commentSchema.parse({ comment, postId });

    // Find author by email
    const author = await client.fetch(
      `*[_type == "author" && email == $email][0]{
        _id,
        name,
        username,
        image
      }`, 
      { email: session.user.email }
    );
    
    console.log("Found author:", author);
    
    if (!author?._id) {
      return { status: "ERROR", error: "Author not found" };
    }

    // Create the comment document
    const newComment = await writeClient.create({
      _type: "comment",
      comment: validatedData.comment,
      createdAt: new Date().toISOString(),
      author: { _type: "reference", _ref: author._id },
      post: { _type: "reference", _ref: validatedData.postId }
    });

    console.log("Created comment:", newComment);

    // Add comment reference to the post's comments array
    await writeClient
      .patch(validatedData.postId)
      .setIfMissing({ comments: [] })
      .append('comments', [{ 
        _key: `comment_${newComment._id.replace(/[^a-zA-Z0-9]/g, '')}`,
        _type: 'reference', 
        _ref: newComment._id 
      }])
      .commit();

    return { status: "SUCCESS", comment: newComment };
  } catch (error) {
    console.error("Error adding comment:", error);
    
    if (error instanceof Error) {
      return { status: "ERROR", error: error.message };
    }
    
    return { status: "ERROR", error: "Failed to add comment" };
  }
};

/**
 * Delete a comment
 */
export const deleteComment = async (form: FormData) => {
  try {
    const session = await auth();
    
    if (!session) {
      return { status: "ERROR", error: "You must be signed in to delete comments" };
    }

    const commentId = form.get("commentId") as string;
    const postId = form.get("postId") as string;

    if (!commentId || !postId) {
      return { status: "ERROR", error: "Missing comment or post ID" };
    }

    // Delete the comment
    await writeClient.delete(commentId);

    // Remove comment reference from post
    await writeClient
      .patch(postId)
      .unset([`comments[_ref == "${commentId}"]`])
      .commit();

    return { status: "SUCCESS" };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { status: "ERROR", error: "Failed to delete comment" };
  }
};

/**
 * Toggle like on a post
 */
export const toggleLike = async (form: FormData) => {
  try {
    const session = await auth();
    
    if (!session) {
      return { status: "ERROR", error: "You must be signed in to like posts" };
    }

    const postId = form.get("postId") as string;
    
    if (!postId) {
      return { status: "ERROR", error: "Post ID is required" };
    }

    // Find author by email
    const author = await client.fetch(
      `*[_type == "author" && email == $email][0]{_id}`, 
      { email: session.user.email }
    );
    
    if (!author?._id) {
      return { status: "ERROR", error: "Author not found" };
    }

    // Check if user already liked the post
    const post = await client.fetch(`
      *[_type == "post" && _id == $postId] {
        likes[] {
          _ref
        }
      }[0]
    `, { postId });

    const hasLiked = post?.likes?.some((like: any) => like._ref === author._id);

    if (hasLiked) {
      // Unlike: remove from likes array
      await writeClient
        .patch(postId)
        .unset([`likes[_ref == "${author._id}"]`])
        .commit();
    } else {
      // Like: add to likes array
      await writeClient
        .patch(postId)
        .setIfMissing({ likes: [] })
        .append('likes', [{ 
          _key: `like_${author._id.replace(/[^a-zA-Z0-9]/g, '')}`,
          _type: 'reference', 
          _ref: author._id 
        }])
        .commit();
    }

    return { status: "SUCCESS", liked: !hasLiked };
  } catch (error) {
    console.error("Error toggling like:", error);
    return { status: "ERROR", error: "Failed to toggle like" };
  }
};

/**
 * Get comments for a post
 */
export const getComments = async (postId: string) => {
  try {
    if (!postId) {
      return { status: "ERROR", error: "Post ID is required" };
    }

    console.log("Fetching comments for post:", postId);

    // First get the post to see what comment references it has
    const post = await client.fetch(`
      *[_type == "post" && _id == $postId][0] {
        comments[] {
          _key,
          _ref
        }
      }
    `, { postId });

    console.log("Post with comment references:", post);

    if (!post?.comments || post.comments.length === 0) {
      return { 
        status: "SUCCESS", 
        comments: [] 
      };
    }

    // Get the actual comment documents using the references
    const commentRefs = post.comments.map((ref: any) => ref._ref);
    const comments = await client.fetch(`
      *[_type == "comment" && _id in $commentRefs] | order(createdAt asc) {
        _id,
        comment,
        createdAt,
        author-> {
          _id,
          name,
          username,
          image
        }
      }
    `, { commentRefs });

    console.log("Fetched comment documents:", comments);

    // Map the comments back to include the _key from the post
    const commentsWithKeys = comments.map((comment: any) => {
      const postComment = post.comments.find((ref: any) => ref._ref === comment._id);
      return {
        ...comment,
        _key: postComment?._key || comment._id
      };
    });

    return { 
      status: "SUCCESS", 
      comments: commentsWithKeys
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { status: "ERROR", error: "Failed to fetch comments" };
  }
};

/**
 * Initialize views for existing games that don't have the field
 */
export const initializeGameViews = async () => {
  try {
    // Get all games that don't have views field
    const gamesWithoutViews = await client.fetch(`
      *[_type == "game" && !defined(views)] {
        _id,
        title
      }
    `);

    console.log(`Found ${gamesWithoutViews.length} games without views field`);

    let updatedCount = 0;
    for (const game of gamesWithoutViews) {
      await writeClient
        .patch(game._id)
        .set({ views: 0 })
        .commit();
      updatedCount++;
    }

    console.log(`Initialized views for ${updatedCount} games`);
    return { status: "SUCCESS", updatedCount };
  } catch (error) {
    console.error("Error initializing game views:", error);
    return { status: "ERROR", error: "Failed to initialize views" };
  }
};

/**
 * Initialize views for existing posts that don't have the field
 */
export const initializePostViews = async () => {
  try {
    // Get all posts that don't have views field
    const postsWithoutViews = await client.fetch(`
      *[_type == "post" && !defined(views)] {
        _id,
        title
      }
    `);

    console.log(`Found ${postsWithoutViews.length} posts without views field`);

    let updatedCount = 0;
    for (const post of postsWithoutViews) {
      await writeClient
        .patch(post._id)
        .set({ views: 0 })
        .commit();
      updatedCount++;
    }

    console.log(`Initialized views for ${updatedCount} posts`);
    return { status: "SUCCESS", updatedCount };
  } catch (error) {
    console.error("Error initializing post views:", error);
    return { status: "ERROR", error: "Failed to initialize views" };
  }
};

/**
 * Increment post views
 */
export const incrementPostViews = async (postId: string) => {
  try {
    if (!postId) {
      return { status: "ERROR", error: "Post ID is required" };
    }

    // Increment the views count
    await writeClient
      .patch(postId)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();

    return { status: "SUCCESS" };
  } catch (error) {
    console.error("Error incrementing post views:", error);
    return { status: "ERROR", error: "Failed to increment views" };
  }
};

/**
 * Fix existing comments and likes that are missing _key properties
 * This is a one-time fix for existing data
 */
export const fixMissingKeys = async (form: FormData) => {
  try {
    const session = await auth();
    
    if (!session) {
      return { status: "ERROR", error: "You must be signed in" };
    }

    // Get all posts with comments or likes
    const posts = await client.fetch(`
      *[_type == "post" && (count(comments) > 0 || count(likes) > 0)] {
        _id,
        comments[] {
          _key,
          _ref
        },
        likes[] {
          _key,
          _ref
        }
      }
    `);

    let fixedCount = 0;

    for (const post of posts) {
      let needsUpdate = false;
      const updatedComments = [];
      const updatedLikes = [];

      // Fix comments
      if (post.comments) {
        for (const comment of post.comments) {
          if (!comment._key) {
            updatedComments.push({
              _key: `comment_${comment._ref.replace(/[^a-zA-Z0-9]/g, '')}`,
              _type: 'reference',
              _ref: comment._ref
            });
            needsUpdate = true;
          } else {
            updatedComments.push(comment);
          }
        }
      }

      // Fix likes
      if (post.likes) {
        for (const like of post.likes) {
          if (!like._key) {
            updatedLikes.push({
              _key: `like_${like._ref.replace(/[^a-zA-Z0-9]/g, '')}`,
              _type: 'reference',
              _ref: like._ref
            });
            needsUpdate = true;
          } else {
            updatedLikes.push(like);
          }
        }
      }

      // Update post if needed
      if (needsUpdate) {
        await writeClient
          .patch(post._id)
          .set({
            comments: updatedComments,
            likes: updatedLikes
          })
          .commit();
        fixedCount++;
      }
    }

    return { 
      status: "SUCCESS", 
      message: `Fixed ${fixedCount} posts with missing keys` 
    };
  } catch (error) {
    console.error("Error fixing missing keys:", error);
    return { status: "ERROR", error: "Failed to fix missing keys" };
  }
};

/**
 * Increment game views
 */
export const incrementGameViews = async (gameId: string) => {
  try {
    if (!gameId) {
      return { status: "ERROR", error: "Game ID is required" };
    }

    // Increment the views count
    await writeClient
      .patch(gameId)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();

    return { status: "SUCCESS" };
  } catch (error) {
    console.error("Error incrementing game views:", error);
    return { status: "ERROR", error: "Failed to increment views" };
  }
};

/**
 * Toggle follow status for a user
 */
export const toggleFollow = async (formData: FormData) => {
  try {
    const userId = formData.get("userId") as string;
    const currentUserId = formData.get("currentUserId") as string;

    console.log("toggleFollow called with:", { userId, currentUserId });

    if (!userId || !currentUserId) {
      return { status: "ERROR", error: "User ID and current user ID are required" };
    }

    if (userId === currentUserId) {
      return { status: "ERROR", error: "You cannot follow yourself" };
    }

    // Get the target user's author document (the user being followed)
    const targetUser = await client.fetch(`
      *[_type == "author" && _id == $userId][0] {
        _id,
        followers
      }
    `, { userId });

    console.log("Target user:", targetUser);

    if (!targetUser) {
      return { status: "ERROR", error: "Target user not found" };
    }

    // Check if current user is already following the target user
    const isFollowing = targetUser.followers?.some((follower: any) => follower._ref === currentUserId);
    console.log("Is following:", isFollowing);

    if (isFollowing) {
      // Unfollow - remove current user from target user's followers
      console.log("Unfollowing user");
      await writeClient
        .patch(userId)
        .unset([`followers[_ref == "${currentUserId}"]`])
        .commit();
    } else {
      // Follow - add current user to target user's followers
      console.log("Following user");
      await writeClient
        .patch(userId)
        .setIfMissing({ followers: [] })
        .append('followers', [{ _type: 'reference', _ref: currentUserId }])
        .commit();
    }

    console.log("Follow toggle completed successfully");
    return { status: "SUCCESS" };
  } catch (error) {
    console.error("Error toggling follow:", error);
    return { status: "ERROR", error: "Failed to update follow status" };
  }
};

/**
 * Initialize followers for existing authors that don't have the field
 */
export const initializeAuthorFollowers = async () => {
  try {
    // Get all authors that don't have followers field
    const authorsWithoutFollowers = await client.fetch(`
      *[_type == "author" && !defined(followers)] {
        _id,
        name
      }
    `);

    console.log(`Found ${authorsWithoutFollowers.length} authors without followers field`);

    let updatedCount = 0;
    for (const author of authorsWithoutFollowers) {
      await writeClient
        .patch(author._id)
        .set({ followers: [] })
        .commit();
      updatedCount++;
    }

    console.log(`Initialized followers for ${updatedCount} authors`);
    return { status: "SUCCESS", updatedCount };
  } catch (error) {
    console.error("Error initializing author followers:", error);
    return { status: "ERROR", error: "Failed to initialize followers" };
  }
};

/**
 * Initialize views for existing posts that don't have the field
 */