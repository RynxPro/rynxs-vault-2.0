import Link from "next/link";
import React from "react";
import Image from "next/image";
import { auth, signIn, signOut } from "@/auth";
import { BsGithub } from "react-icons/bs";

const Navbar = async () => {
  const session = await auth();

  return (
    <header className="px-5 py-1 bg-[#73e2ff] shadow-md font-work-sans border-b-6 border-black">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <Image src="/logo.png" alt="logo" width={150} height={30} />
        </Link>

        <div className="flex items-center gap-5 text-black">
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
                <span className="bg-white text-black px-3 py-1 rounded-full font-semibold">
                  {session?.user?.name}
                </span>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";

                await signIn("github");
              }}
            >
              <button className="login-btn" type="submit">
                Login
                <BsGithub className="text-3xl flex" />
              </button>
            </form>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
