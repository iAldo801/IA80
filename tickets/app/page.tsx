
import { VerificiationWarning } from "@/components/ui/verificiation-warning";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import Link from "next/link";

export default async function Home() {
  const { user } = await validateRequest();
  return (
    <main className="flex flex-col items-start p-24">
      {user ? (
        <div>
          <h1 className="text-4xl font-bold">Welcome back, {user.username}!</h1>
          <p className="text-lg">You are now logged in.</p>
          <VerificiationWarning />
        </div>
      ) : (
        <div>
          <h1 className="text-4xl font-bold">Welcome to IA80</h1>
          <p className="text-lg">Please <Link className="hover:border-b-black hover:border-2 hover:border-t-0 hover:border-l-0 hover:border-r-0" href={Paths.Login}>log in</Link> or <Link className="hover:border-b-black hover:border-2 hover:border-t-0 hover:border-l-0 hover:border-r-0" href={Paths.Signup}>sign up</Link> to continue.</p>
        </div>
      )}
    </main>
  );
}