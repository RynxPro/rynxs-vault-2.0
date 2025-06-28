import GameForm from "@/components/ui/GameForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Game - Rynx's Vault",
  description: "Share your game with the community. Upload your creation and connect with fellow developers and players.",
  keywords: ["upload game", "share game", "indie games", "game development", "gaming community"],
  openGraph: {
    title: "Upload Game - Rynx's Vault",
    description: "Share your game with the community. Upload your creation and connect with fellow developers and players.",
    type: "website",
  },
};

export default function GameUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Share Your Game
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto leading-relaxed">
              Upload your creation and let the world discover your talent. Connect with players, 
              get feedback, and grow your community.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="py-12">
        <GameForm />
      </div>
    </div>
  );
}
