import prisma from "@/server/prisma";
import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { User as DbUser, PrismaClient } from "@prisma/client";
import { Lucia, TimeSpan } from "lucia";


const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
    getSessionAttributes: (/* attributes */) => {
        return {};
    },
    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            username: attributes.username,
            email: attributes.email,
            emailVerified: attributes.emailVerified,
            avatar: attributes.avatar,
            createdAt: attributes.createdAt,
            updatedAt: attributes.updatedAt,
        };
    },
    sessionExpiresIn: new TimeSpan(30, "d"),
    sessionCookie: {
        name: "session",
        expires: false,
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
});

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseSessionAttributes: DatabaseSessionAttributes;
        DatabaseUserAttributes: DatabaseUserAttributes;
    }
}

interface DatabaseSessionAttributes { }

interface DatabaseUserAttributes extends Omit<DbUser, "hashedPassword"> { }