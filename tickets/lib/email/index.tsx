import "server-only";

import { EMAIL_SENDER } from "@/lib/constants";
import { render } from "@react-email/render";
import { createTransport, type TransportOptions } from "nodemailer";
import type { ComponentProps } from "react";
import { EmailVerificationTemplate } from "./templates/email-verification";

export enum EmailTemplate {
    EmailVerification = "EmailVerification",
    PasswordReset = "PasswordReset",
}

export type PropsMap = {
    [EmailTemplate.EmailVerification]: ComponentProps<typeof EmailVerificationTemplate>;
};

const getEmailTemplate = <T extends keyof PropsMap>(template: T, props: PropsMap[T]) => {
    switch (template) {
        case EmailTemplate.EmailVerification:
            return {
                subject: "Verify your email address",
                body: render(
                    <EmailVerificationTemplate {...(props as PropsMap[EmailTemplate.EmailVerification])} />,
                ),
            };
        default:
            throw new Error("Invalid email template");
    }
};

const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
};

const transporter = createTransport(smtpConfig as TransportOptions);

export const sendMail = async <T extends keyof PropsMap>(
    to: string,
    template: T,
    props: PropsMap[T],
) => {
    if (process.env.NODE_ENV !== "production") {
        console.log("📨 Email sent to:", to, "with template:", template, "and props:", props);
        return;
    }

    const { subject, body } = getEmailTemplate(template, props);

    return transporter.sendMail({ from: EMAIL_SENDER, to, subject, html: body });
};