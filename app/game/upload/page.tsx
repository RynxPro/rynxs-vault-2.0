import { auth } from "@/auth";
import { redirect } from "next/navigation";
import GameForm from "@/components/ui/GameForm";

const Page = async () => {
  const session = await auth();

  if (!session) redirect("/");

  return (
    <>
      <section className="main_container !min-h-[230px]">
        <h1 className="heading">Create Your Game!</h1>
      </section>

      <GameForm />
    </>
  );
};

export default Page;
