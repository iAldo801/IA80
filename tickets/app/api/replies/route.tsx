import { validateRequest } from "@/lib/auth/validate-request";
import prisma from "@/server/prisma";
import { generateId } from "lucia";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { user } = await validateRequest()
  try {
    const { ticketId, body, userId } = await req.json();

    if (!user) {
      return NextResponse.json({ message: "You must be logged in to reply to a ticket" }, { status: 401 });
    }
    if (!ticketId || !body || !userId) {
      return NextResponse.json({ message: "Please fill out all fields" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { assignments: true },
    });

    if (!ticket) {
      return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
    }

    const isAuthorized = ticket.userId === userId || ticket.assignments.some(assignment => assignment.assignedUserId === userId);

    if (!isAuthorized) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const reply = await prisma.ticketReply.create({
      data: {
        id: generateId(21),
        ticketId,
        userId,
        body,
      },
    });

    return NextResponse.json(reply);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
