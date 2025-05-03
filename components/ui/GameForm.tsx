"use client";

import React, { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createGame } from "@/lib/actions";

const GameForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const handleFormSubmit = async (prevState: any, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        image: formData.get("image") as string,
      };

      await formSchema.parseAsync(formValues);

      const pitch = formData.get("pitch") as string; // Assuming pitch is part of the form data
      const result = await createGame(prevState, formData, pitch);

      if (result.status === "SUCCESS") {
        toast.success("Your game has been created successfully");

        router.push(`/game/${result._id}`);
      }

      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;

        setErrors(fieldErrors as unknown as Record<string, string>);

        toast.error("Please check your inputs and try again");

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast.error("An unexpected error has occurred");

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(handleFormSubmit, {
    error: "",
    status: "INITIAL",
  });

  return (
    <form action={formAction} className="game-form">
      <div>
        <label htmlFor="title" className="game-form_label">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="game-form_input"
          required
          placeholder="Game Title"
        />
        {errors.title && <p className="game-form_error">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="game-form_label">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="game-form_textarea"
          required
          placeholder="Game Description"
        />
        {errors.description && (
          <p className="game-form_error">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="game-form_label">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="game-form_input"
          required
          placeholder="Game Category (e.g., FPS, Souls-Like...)"
        />
        {errors.category && (
          <p className="game-form_error">{errors.category}</p>
        )}
      </div>

      <div>
        <label htmlFor="link" className="game-form_label">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="game-form_input"
          required
          placeholder="Game Image URL"
        />

        {errors.link && <p className="game-form_error">{errors.link}</p>}
      </div>

      <button
        type="submit"
        className="game-form_btn text-white"
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Your Game"}
        <Send className="size-6 ml-2" />
      </button>
    </form>
  );
};

export default GameForm;
