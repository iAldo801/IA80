import CreateTicket from "@/components/ticket/CreateTicket";
import { validateRequest } from "@/lib/auth/validate-request";

export default async function CreateTicketPage() {
    const { user } = await validateRequest();

    return <CreateTicket user={user} {...(null as any)} />
}