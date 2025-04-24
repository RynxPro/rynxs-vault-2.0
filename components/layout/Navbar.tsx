import Link from "next/link";
import React from "react";
import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";
import { BsGithub } from "react-icons/bs";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="bg-secondary px-5 py-1 shadow-md font-work-sans border-b-5 border-black">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={150} height={30} />
        </Link>

        <div className="flex items-center gap-5">
          {session && session?.user ? (
            <>
              <Link href={"/games/upload"}>
                <span>Upload</span>
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
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";

                await signIn("github");
              }}
            >
              <button className="!text-secondary login-btn" type="submit">
                Login
                <BsGithub className="text-3xl flex text-secondary" />
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
