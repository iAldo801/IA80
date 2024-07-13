import Tickets from "@/components/ticket/Tickets";
import { validateRequest } from "@/lib/auth/validate-request";
import { fetchTickets, fetchUsers } from "@/lib/fetch";

export default async function TicketsPage() {
    const { user } = await validateRequest();
    const allUsers = await fetchUsers();
    const data = await fetchTickets();

    return (
        <div className="flex flex-col items-center p-24">
            <Tickets tickets={data} user={user} allUsers={allUsers} />
        </div>
    )
}