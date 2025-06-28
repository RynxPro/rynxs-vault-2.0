import PostForm from "@/components/ui/PostForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Post - Rynx's Vault",
  description: "Share your thoughts, updates, and experiences about your games with the community.",
  keywords: ["create post", "game blog", "game updates", "gaming community", "game development"],
  openGraph: {
    title: "Create Post - Rynx's Vault",
    description: "Share your thoughts, updates, and experiences about your games with the community.",
    type: "website",
  },
};

export default function PostUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Share Your Story
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Connect with your community by sharing updates, insights, and experiences 
              about your games. Build relationships and inspire others.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-12">
        <PostForm />
      </div>
    </div>
  );
} 