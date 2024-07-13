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
import { IconLucide } from "@/lib/icon-lucide";
import { useState } from "react";
import { toast } from "sonner";
import { LoadingButton } from "./loading-button";

const CloseTicketConfirmation = ({ ticketId, user }: { ticketId: string, user: any }) => {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleCloseTicket = async () => {
        setIsLoading(true);
        const response = await fetch('/api/tickets/close', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticketId, closedBy: user.username }),
        });
        if (!response.ok) {
            throw new Error('Failed to close the ticket');
        }
        toast.success("Ticket closed successfully", {
            description: `Ticket ${ticketId} has been closed.`,
        });
        setIsLoading(false);
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger
                className="flex px-2 py-1.5 text-sm text-black outline-none"
                asChild
            >
                <Button variant={'outline'} size={'sm'} className="text-red-500 hover:bg-red-500 hover:text-red-50">
                    <IconLucide name="Lock" className="h-4 w-4 mr-2" />
                    Close Ticket
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-xs">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-center">
                        Close Ticket?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to close this ticket?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <LoadingButton loading={isLoading} onClick={handleCloseTicket}>
                        Continue
                    </LoadingButton>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CloseTicketConfirmation;