import { validateRequest } from "@/lib/auth/validate-request";
import prisma from "@/server/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { user } = await validateRequest();
    const { ticketId } = await req.json();

    if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!ticketId) {
        return NextResponse.json({ message: "Ticket ID is required" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
        where: { id: ticketId },
        include: { assignments: true },
    });

    if (!ticket) {
        return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
    }

    const updatedTicket = await prisma.ticket.update({
        where: { id: ticketId },
        data: {
            status: "open",
            closedAt: new Date(),
        },
    });
    return NextResponse.json(updatedTicket);
}