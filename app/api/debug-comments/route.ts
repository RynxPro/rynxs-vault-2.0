import { NextResponse } from 'next/server';
import { client } from '@/sanity/lib/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  
  if (!postId) {
    return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
  }
  
  try {
    // Get the post with all comments
    const post = await client.fetch(`
      *[_type == "post" && _id == $postId] {
        _id,
        title,
        "commentCount": count(comments),
        comments[] {
          _key,
          author->{
            _id,
            name,
            username,
            image
          },
          comment,
          createdAt
        } | order(createdAt desc)
      }[0]
    `, { postId });
    
    return NextResponse.json({
      post,
      commentCount: post?.commentCount || 0,
      comments: post?.comments || []
    });
  } catch (error) {
    console.error("Debug error:", error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 