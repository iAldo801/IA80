import ReplyForm from "@/components/ticket/ReplyForm";
import { Button } from "@/components/ui/button";
import { validateRequest } from "@/lib/auth/validate-request";
import { getTicketById, getTicketReplies } from "@/lib/db/actions";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
    params: {
        id: string;
    }
};

export default async function TicketPage({ params }: Props) {
    const { user } = await validateRequest();
    const { id } = params;
    const ticket = await getTicketById(id);
    const replies = await getTicketReplies(id);

    if (!ticket) {
        notFound();
    }

    const assignedUser = ticket.assignments.length > 0 ? ticket.assignments[0].assignedUser : null;
    const canReply = user && ticket.status !== "closed" && (ticket.userId === user.id || (assignedUser && assignedUser.id === user.id));

    return (
        <div className="flex flex-col mx-auto justify-center gap-4 p-24 max-w-[80rem]">
            <Link href={"/tickets"}>
                <Button>Go back</Button>
            </Link>
            <header className="bg-secondary border flex justify-between items-center p-4">
                <h1 className="text-5xl font-bold">
                    {ticket.title}
                </h1>
                <div className="flex items-center gap-4">
                    <div>
                        <div className={`${ticket.status === "open" ? "bg-green-500 border-green-400 border" : ""}${ticket.status === "closed" ? "bg-red-500 border-red-400 border" : ""} p-2 rounded-sm text-white text-center w-44 mb-2`}>
                            <p>{ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}</p>
                        </div>
                        <div className={`${assignedUser ? "bg-green-500 border-green-400 border" : "bg-red-500 border-red-400 border"} p-2 rounded-sm text-white text-center w-44`}>
                            <p>{assignedUser ? `Assigned to ${assignedUser.username}` : "Not assigned"}</p>
                        </div>
                    </div>
                </div>
            </header>
            <div className="bg-secondary border flex flex-col p-4">
                <div className="flex flex-col">
                    <article dangerouslySetInnerHTML={{ __html: ticket.body }} />
                    <div className="flex mt-2 gap-2 items-center">
                        <p className="text-gray-500">Created by:</p>
                        <p>{ticket.userId === user?.id ? "you" : ticket.username}</p>
                        <p className="text-gray-500">on</p>
                        <p>{new Date(ticket.createdAt).toLocaleDateString()}</p>
                        <p className="text-gray-500">at</p>
                        <p>{new Date(ticket.createdAt).toLocaleTimeString().split(":").slice(0, 2).join(":")}</p>
                        <p>{new Date(ticket.createdAt).toLocaleTimeString().split(" ")[1]}</p>
                    </div>
                </div>

            </div>
            <div>
                <h2 className="text-3xl font-bold">Replies</h2>
            </div>


            {replies.map((reply) => (
                <div key={reply.id} className="bg-secondary border p-4">
                    <div>
                        <article dangerouslySetInnerHTML={{ __html: reply.body }} />
                        <div className="flex mt-2 gap-2 items-center">
                            <p className="text-gray-500">Replied by:</p>
                            <p>{reply.user.username}</p>
                            <p className="text-gray-500">on</p>
                            <p>{new Date(reply.createdAt).toLocaleDateString()}</p>
                            <p className="text-gray-500">at</p>
                            <p>{new Date(reply.createdAt).toLocaleTimeString().split(":").slice(0, 2).join(":")}</p>
                            <p>{new Date(reply.createdAt).toLocaleTimeString().split(" ")[1]}</p>
                        </div>
                    </div>
                </div>
            ))}
            {canReply ? (
                <div className="bg-secondary border p-4">
                    <ReplyForm ticketId={ticket.id} userId={user.id} />
                </div>
            ) : (
                <div className="bg-secondary border p-4">
                    <p className="text-center">
                        This ticket is {ticket.status === "closed" ? "closed" : "not assigned to you"}.
                    </p>
                </div>
            )}

        </div>
    );
}