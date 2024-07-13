import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import Link from "next/link";
import AuthDropdown from "../ui/auth-dropdown";
import { UserDropdown } from "../ui/user-dropdown";

export default async function Navbar() {
    const { user } = await validateRequest();
    return (
        <header className="top-0 left-0 right-0 flex items-center justify-between px-24 py-8 bg-white shadow-md">
            <h1 className="text-2xl font-bold">IA80</h1>
            <nav>
                <ul className="flex items-center space-x-8">
                    <li>
                        <Link href={Paths.Home} className="text-black hover:text-accent-foreground">Home</Link>
                    </li>
                    <li>
                        <Link href={"/tickets"} className="text-black hover:text-accent-foreground">Tickets</Link>
                    </li>
                    <li>
                        <Link href={"/tickets/create"} className="text-black hover:text-accent-foreground">Create a Ticket</Link>
                    </li>
                    <li>
                        {user ? null : <AuthDropdown />}
                    </li>
                    <li>
                        {user ? <UserDropdown email={user.email} /> : null}
                    </li>
                </ul>
            </nav>
        </header>
    )
}