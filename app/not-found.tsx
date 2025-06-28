import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <section className="main_container bg-paper">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="game-card_btn inline-block text-center"
            aria-label="Go back to homepage"
          >
            Go Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="game-card_btn inline-block text-center"
            aria-label="Go back to previous page"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
} 