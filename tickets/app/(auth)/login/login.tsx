"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { SubmitButton } from "@/components/ui/submit-button";
import { login } from "@/lib/auth/actions";
import { APP_TITLE, Paths } from "@/lib/constants";
import Link from "next/link";
import { useFormState } from "react-dom";

export function Login() {
    const [state, formAction] = useFormState(login, null);

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle>{APP_TITLE}</CardTitle>
                <CardDescription>
                    Log in to your account to access your dashboard
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="grid gap-4">
                    <div className="space-y-2">
                        <Label>Username or Email</Label>
                        <Input
                            required
                            placeholder="Username or email"
                            autoComplete="username"
                            name="identifier"
                            type="text"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Password</Label>
                        <PasswordInput
                            name="password"
                            required
                            autoComplete="current-password"
                            placeholder="********"
                        />
                    </div>

                    <div className="flex flex-wrap justify-between">
                        <Button variant={"link"} size={"sm"} className="p-0" asChild>
                            <Link href={Paths.Signup}>Not signed up? Sign up now.</Link>
                        </Button>
                        <Button variant={"link"} size={"sm"} className="p-0" asChild>
                            <Link href={"/reset-password"}>Forgot password?</Link>
                        </Button>
                    </div>

                    {state?.fieldError ? (
                        <ul className="list-disc space-y-1 rounded-sm border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
                            {Object.values(state.fieldError).map((err) => (
                                <li className="ml-4" key={err}>
                                    {err}
                                </li>
                            ))}
                        </ul>
                    ) : state?.formError ? (
                        <p className="rounded-sm border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
                            {state?.formError}
                        </p>
                    ) : null}
                    <SubmitButton className="w-full">Log In</SubmitButton>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/">Cancel</Link>
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
