import Link from "next/link";
import React from "react";
import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";
import { BsGithub } from "react-icons/bs";
import { Sun, Moon } from "lucide-react";
import DarkModeToggle from "../ui/DarkModeToggle";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="bg-background px-5 py-1 shadow-md font-work-sans border-b-3 border-black">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={150} height={30} />
        </Link>

        <div className="flex items-center gap-5">
          <DarkModeToggle />
          {session && session?.user ? (
            <>
              <Link href={"/game/upload"}>
                <button className="text-black profile-btn poi" type="submit">
                  create
                </button>
              </Link>

              <form
                action={async () => {
                  "use server";

                  await signOut({ redirectTo: "/" });
                }}
              >
                <button className="logout-btn" type="submit">
                  Logout
                </button>
              </form>

              <Link href={`/user/${session?.user?.id}`}>
                <span className="profile-btn">{session?.user?.name}</span>
                <img
                  src={session?.user?.image || "/default-avatar.png"}
                  alt="Profile picture"
                  className="w-8 h-8 rounded-full"
                />
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";

                await signIn("github");
              }}
            >
              <button className="!text-black login-btn" type="submit">
                Login
                <BsGithub className="text-3xl flex text-black" />
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
