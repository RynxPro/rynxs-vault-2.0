"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Github, Twitter, Mail, Gamepad2 } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary-500 rounded-lg">
                  <Gamepad2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Rynx&apos;s Vault
                  </h3>
                  <p className="text-gray-600 text-sm">Your Gaming Sanctuary</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed max-w-md">
                Discover, share, and celebrate the best indie games. Connect
                with developers, explore new worlds, and be part of a thriving
                gaming community.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full group-hover:scale-150 transition-transform"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/game/upload"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full group-hover:scale-150 transition-transform"></span>
                    Upload Game
                  </Link>
                </li>
                <li>
                  <Link
                    href="/post/upload"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full group-hover:scale-150 transition-transform"></span>
                    Create Post
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studio"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full group-hover:scale-150 transition-transform"></span>
                    Studio
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">
                Connect
              </h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:contact@rynxvault.com"
                    className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 text-gray-600">
                <span>© {currentYear} Rynx&apos;s Vault. Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
                <span>for the gaming community</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <span>with the help of</span>
                <a
                  href="https://code213.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <Image
                    src="https://code213.tech/_next/static/media/newLogo-code213.17bfb094.svg"
                    alt="Code213"
                    width={100}
                    height={100}
                    className="inline-block"
                  />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link
                href="/privacy"
                className="hover:text-primary-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="hover:text-primary-600 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="hover:text-primary-600 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
