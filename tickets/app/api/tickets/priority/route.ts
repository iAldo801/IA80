import { validateRequest } from "@/lib/auth/validate-request";
import prisma from "@/server/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req: NextRequest) {
    const { user } = await validateRequest();
    const { ticketId, priority } = await req.json();

    if (!user) {
        return NextResponse.json({ message: "You must be logged in to update ticket priority" }, { status: 401 });
    }

    if (!ticketId || !priority) {
        return NextResponse.json({ message: "Please provide a ticket ID and priority" }, { status: 400 });
    }

    try {
        const updatedTicket = await prisma.ticket.update({
            where: { id: ticketId },
            data: { priority },
        });
        return NextResponse.json(updatedTicket);
    } catch (error) {
        return NextResponse.json({ message: "An error occurred while updating ticket priority" }, { status: 500 });
    }
}