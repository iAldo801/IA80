import prisma from "@/server/prisma";

export async function getTickets() {
    return await prisma.ticket.findMany({
        select: {
            id: true,
            title: true,
            body: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
        },
    });
}

export async function getTicketById(id: string) {
    return await prisma.ticket.findUnique({
        where: {
            id: id,
        },
        include: {
            assignments: {
                include: {
                    assignedUser: true,
                },
            },
        },
    });
}

export async function getTicketReplies(id: string) {
    return await prisma.ticketReply.findMany({
        where: {
            ticketId: id,
        },
        include: {
            user: true,
        },
    });
}