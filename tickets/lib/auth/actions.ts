"use server";

/* eslint @typescript-eslint/no-explicit-any:0, @typescript-eslint/prefer-optional-chain:0 */

import { lucia } from "@/lib/auth";
import { validateRequest } from "@/lib/auth/validate-request";
import {
    loginSchema,
    signupSchema,
    type LoginInput
} from "@/lib/validators/auth";
import prisma from "@/server/prisma";
import { generateId, Scrypt } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createDate, isWithinExpirationDate, TimeSpan } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { Paths } from "../constants";
import { EmailTemplate, sendMail } from "../email";

export interface ActionResponse<T> {
    fieldError?: Partial<Record<keyof T, string | undefined>>;
    formError?: string;
}

export async function login(_: any, formData: FormData): Promise<ActionResponse<LoginInput>> {
    const obj = Object.fromEntries(formData.entries());

    const parsed = loginSchema.safeParse(obj);
    if (!parsed.success) {
        const err = parsed.error.flatten();
        return {
            fieldError: {
                identifier: err.fieldErrors.identifier?.[0],
                password: err.fieldErrors.password?.[0],
            },
        };
    }

    const { identifier, password } = parsed.data;

    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { username: identifier },
            ],
        },
    });

    if (!existingUser || !existingUser.hashedPassword) {
        return {
            formError: "Incorrect identifier or password",
        };
    }

    const validPassword = await new Scrypt().verify(existingUser.hashedPassword, password);
    if (!validPassword) {
        return {
            formError: "Incorrect identifier or password",
        };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect(Paths.Home);
}

export async function signup(_: any, formData: FormData) {
    const obj = Object.fromEntries(formData.entries());

    const parsed = signupSchema.safeParse(obj);
    if (!parsed.success) {
        const err = parsed.error.flatten();
        return {
            fieldError: {
                email: err.fieldErrors.email?.[0],
                username: err.fieldErrors.username?.[0],
                password: err.fieldErrors.password?.[0],
            },
        };
    }

    const { email, username, password } = parsed.data;

    const existingUserMail = await prisma.user.findFirst({
        where: { email },
    });

    const existingUserUsername = await prisma.user.findFirst({
        where: { username },
    });

    if (existingUserMail) {
        return {
            formError: "There is already an account with that email, if you forgot your password, you can reset it by clicking the 'Forgot Password' link on the login page.",
        };
    }

    if (existingUserUsername) {
        return {
            formError: "That username is already taken. Please try another one.",
        };
    }

    const userId = generateId(21);
    const hashedPassword = await new Scrypt().hash(password);

    await prisma.user.create({
        data: {
            id: userId,
            avatar: "https://source.boringavatars.com/marble/60/",
            username,
            email,
            hashedPassword,
        },
    });

    const verificationCode = await generateEmailVerificationCode(userId, email);
    await sendMail(email, EmailTemplate.EmailVerification, { code: verificationCode });

    const session = await lucia.createSession(userId, {}).then((s) => s);
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect(Paths.VerifyEmail);
}

export async function logout(): Promise<{ error: string } | void> {
    const { session } = await validateRequest();
    if (!session) {
        return {
            error: "No session found",
        };
    }
    await lucia.invalidateSession(session.id);
    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect(Paths.Home);
}

export async function resendVerificationEmail(): Promise<{ error?: string; success?: boolean; }> {
    const { user } = await validateRequest();
    if (!user) {
        return redirect(Paths.Login);
    }

    const lastSent = await prisma.emailVerificationCode.findFirst({
        where: { userId: user.id },
        select: { expiresAt: true },
    });

    if (lastSent && isWithinExpirationDate(lastSent.expiresAt)) {
        return {
            error: `Please wait ${timeFromNow(lastSent.expiresAt)} before resending`,
        };
    }

    const verificationCode = await generateEmailVerificationCode(user.id, user.email);
    await sendMail(user.email, EmailTemplate.EmailVerification, { code: verificationCode });

    return { success: true };
}

export async function verifyEmail(_: any, formData: FormData): Promise<{ error: string } | void> {
    const code = formData.get("code");
    if (typeof code !== "string" || code.length !== 8) {
        return { error: "Invalid code" };
    }
    const { user } = await validateRequest();
    if (!user) {
        return redirect(Paths.Login);
    }

    const dbCode = await prisma.emailVerificationCode.findFirst({
        where: { userId: user.id },
    });

    if (!dbCode || dbCode.code !== code) return { error: "Invalid verification code" };

    if (!isWithinExpirationDate(dbCode.expiresAt)) return { error: "Verification code expired" };

    if (dbCode.email !== user.email) return { error: "Email does not match" };

    await lucia.invalidateUserSessions(user.id);
    await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
    });
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    redirect(Paths.Home);
}

const timeFromNow = (time: Date) => {
    const now = new Date();
    const diff = time.getTime() - now.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const seconds = Math.floor(diff / 1000) % 60;
    return `${minutes}m ${seconds}s`;
};

async function generateEmailVerificationCode(userId: string, email: string): Promise<string> {
    await prisma.emailVerificationCode.deleteMany({
        where: { userId: userId }
    });

    const code = generateRandomString(8, alphabet("0-9"));

    await prisma.emailVerificationCode.create({
        data: {
            id: generateId(21),
            userId,
            email,
            code,
            expiresAt: createDate(new TimeSpan(5, "m")),
        }
    });

    return code;
}