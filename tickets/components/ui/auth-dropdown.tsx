import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Paths } from "@/lib/constants";
import { IconLucide } from "@/lib/icon-lucide";
import Link from "next/link";

export default function AuthDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Auth
                    <IconLucide name="ChevronDown" className="h-4 w-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-black">
                    <Link href={Paths.Login} className="text-black hover:text-accent-foreground">Login</Link>
                </DropdownMenuLabel>
                <DropdownMenuLabel className="text-black">
                    <Link href={Paths.Signup} className="text-black hover:text-accent-foreground">Signup</Link>
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}