"use client";

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth/actions";
import { IconLucide } from "@/lib/icon-lucide";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingButton } from "./loading-button";

export const UserDropdown = ({
    email,
}: {
    email: string;
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    Profile
                    <IconLucide name="ChevronDown" className="h-4 w-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-black">
                    {email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="p-0">
                    <SignoutConfirmation />
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const SignoutConfirmation = () => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignout = async () => {
        setIsLoading(true);
        try {
            await logout();
            toast.success("Signed out successfully", {
                description: "You have been signed out from IA80.",
            });
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message, {
                    icon: (
                        <IconLucide name="TriangleAlert" className="h-4 w-4 text-destructive" />
                    ),
                });
            }
        } finally {
            setOpen(false);
            setIsLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                className="px-2 py-1.5 text-sm text-black outline-none"
                asChild
            >
                <button>Sign out</button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-xs">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                        Sign out from IA80?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be redirected to the home page.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <LoadingButton loading={isLoading} onClick={handleSignout}>
                        Continue
                    </LoadingButton>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};