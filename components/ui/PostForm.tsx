"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPost, getUserGames } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Loader2, CheckCircle, ChevronDown } from "lucide-react";
import Link from "next/link";

interface Game {
  _id: string;
  title: string;
  category: string;
}

export default function PostForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<Game[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    game: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const result = await getUserGames();
        if (
          result &&
          "games" in result &&
          result.status === "SUCCESS" &&
          result.games
        ) {
          const games = Array.isArray(result.games) ? result.games : [];
          setGames(games);
        } else {
          toast.error("Failed to load your games");
        }
      } catch {
        toast.error("Failed to load your games");
      } finally {
        setIsLoadingGames(false);
      }
    };

    fetchGames();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Create FormData object to match the server action signature
      const form = new FormData();
      form.append("title", formData.title);
      form.append("content", formData.content);
      form.append("image", formData.image);
      form.append("game", formData.game);

      const result = await createPost({}, form);

      if (result.status === "SUCCESS") {
        toast.success("Post created successfully!", {
          description: "Your post is now live on the platform.",
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        });
        router.push("/");
      } else {
        throw new Error(result.error || "Failed to create post");
      }
    } catch (error) {
      toast.error("Failed to create post", {
        description:
          error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Create a Post</h1>
              <p className="text-primary-100 text-sm">
                Share your thoughts about your games
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700"
            >
              Post Title *
            </label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter your post title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="h-12 px-4 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl"
            />
          </div>

          {/* Game Selection */}
          <div className="space-y-2">
            <label
              htmlFor="game"
              className="block text-sm font-semibold text-gray-700"
            >
              Select Game *
            </label>
            <div className="relative">
              <select
                id="game"
                name="game"
                value={formData.game}
                onChange={handleInputChange}
                required
                disabled={isLoadingGames}
                className="w-full h-12 px-4 pr-10 border border-gray-200 rounded-xl focus:border-primary-500 focus:ring-primary-500 bg-white disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none"
              >
                <option value="">
                  {isLoadingGames
                    ? "Loading your games..."
                    : "Select a game to post about"}
                </option>
                {games.map((game) => (
                  <option key={game._id} value={game._id}>
                    {game.title} ({game.category})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {games.length === 0 && !isLoadingGames && (
              <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
                You need to upload a game first before creating posts.
                <Link
                  href="/game/upload"
                  className="text-primary-600 hover:text-primary-700 font-medium ml-1"
                >
                  Upload a game →
                </Link>
              </p>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-gray-700"
            >
              Post Content *
            </label>
            <Textarea
              id="content"
              name="content"
              placeholder="Share your thoughts, updates, or experiences with your game..."
              value={formData.content}
              onChange={handleInputChange}
              required
              rows={6}
              className="px-4 py-3 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl resize-none"
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-gray-700"
            >
              Post Image URL
            </label>
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/post-image.jpg (optional)"
              value={formData.image}
              onChange={handleInputChange}
              className="h-12 px-4 border-gray-200 focus:border-primary-500 focus:ring-primary-500 rounded-xl"
            />
            <p className="text-xs text-gray-500">
              Add an image to make your post more engaging (optional)
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || isLoadingGames || games.length === 0}
              className="w-full h-14 text-lg bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold rounded-2xl border border-primary-600 shadow-xl hover:shadow-2xl focus:ring-4 focus:ring-primary-300/40 transition-all duration-200 flex items-center justify-center gap-3 hover:scale-105 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                  Creating Post...
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6 mr-2" />
                  Create Post
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
