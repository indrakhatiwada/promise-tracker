import { PromiseForm } from "@/components/forms/promise-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function NewPromisePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/promises/new");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Submit a New Promise</h1>
      <PromiseForm />
    </div>
  );
}
