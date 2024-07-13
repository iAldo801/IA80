import { validateRequest } from "@/lib/auth/validate-request";
import prisma from "@/server/prisma";
import { generateId } from "lucia";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {


    const tickets = await prisma.ticket.findMany({
        include: {
            assignments: {
                include: {
                    assignedUser: true,
                },
            },
        },
    });

    return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
    const { user } = await validateRequest()
    const { title, body, userId, username } = await req.json();

    if (!user) return NextResponse.json({ message: "You must be logged in to create a ticket" }, { status: 401 });

    if (!title || !body || !userId || !username) return NextResponse.json({ message: "Please fill out all fields" }, { status: 400 });

    const ticket = await prisma.ticket.create({
        data: {
            id: generateId(10),
            title,
            body,
            username,
            userId,
        },
    });
    return NextResponse.json(ticket);
}

export async function PUT(req: NextRequest) {
    const { user } = await validateRequest()
    const { ticketId, assignedUserId } = await req.json();

    if (!user) return NextResponse.json({ message: "You must be logged in to assign a ticket" }, { status: 401 });
    if (!ticketId) return NextResponse.json({ message: "Ticket ID is required" }, { status: 400 });

    const updateData: any = { updatedAt: new Date() };

    if (assignedUserId) {
        updateData.assignments = {
            create: {
                id: generateId(21),
                assignedUserId,
                assignedAt: new Date(),
            }
        };
    } else {
        updateData.assignments = {
            deleteMany: {}
        };
    }

    const ticket = await prisma.ticket.update({
        where: { id: ticketId },
        data: updateData,
    });
    return NextResponse.json(ticket);
}