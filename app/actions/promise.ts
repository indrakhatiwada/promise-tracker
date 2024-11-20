'use server';

import { prisma } from "@/lib/prisma-client";
import { promiseFormSchema } from "@/lib/validations/promise";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export async function createPromise(formData: FormData) {
  try {
    console.log("Starting promise creation...");

    // Get the current user session
    const session = await getServerSession(authOptions);
    console.log("Session:", JSON.stringify(session, null, 2));

    if (!session?.user?.email) {
      console.log("No user session found");
      return { success: false, error: "You must be logged in to submit a promise" };
    }

    // Get user from database
    console.log("Looking up user:", session.user.email);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log("User not found in database");
      return { success: false, error: "User not found" };
    }
    console.log("Found user:", user.id);

    // Parse and validate the form data
    const rawData = {
      promiserName: formData.get("promiserName"),
      description: formData.get("description"),
      party: formData.get("party"),
      articleLink: formData.get("articleLink"),
      screenshot: formData.get("screenshot"),
      promisedDate: formData.get("promisedDate"),
      imageUrl: formData.get("imageUrl"),
    };

    console.log("Raw form data:", rawData);

    try {
      const validatedData = promiseFormSchema.parse(rawData);
      console.log("Validated data:", validatedData);

      // Create the promise
      console.log("Creating promise with data:", {
        ...validatedData,
        userId: user.id,
      });

      const promise = await prisma.promise.create({
        data: {
          promiserName: validatedData.promiserName,
          description: validatedData.description,
          party: validatedData.party,
          articleLink: validatedData.articleLink,
          screenshot: validatedData.screenshot,
          promisedDate: validatedData.promisedDate,
          imageUrl: validatedData.imageUrl,
          userId: user.id,
        },
      }).catch(error => {
        console.error("Database error:", error);
        throw new Error(`Database error: ${error.message}`);
      });

      console.log("Created promise:", promise);

      // Revalidate the promises page
      revalidatePath("/promises");

      return { success: true, data: promise };
    } catch (validationError) {
      console.error("Validation error:", validationError);
      if (validationError instanceof ZodError) {
        const errorMessage = validationError.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
        console.log("Validation error message:", errorMessage);
        return { success: false, error: errorMessage };
      }
      throw validationError;
    }
  } catch (error) {
    console.error("Server error:", error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error message:", errorMessage);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return { success: false, error: errorMessage };
  }
}
