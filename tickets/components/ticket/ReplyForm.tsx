'use client'

import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import { IconLucide } from "@/lib/icon-lucide";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import TextEditor from "../editor/TextEditor";
import { Button } from "../ui/button";

const formSchema = z.object({
    body: z.string().min(1, { message: "Body must be at least 1 character" }),
});

export default function ReplyForm({ ticketId, userId }: any) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            body: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await fetch("/api/replies", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                body: values.body,
                ticketId,
                userId,
            }),
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="body"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <TextEditor {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit">
                    <IconLucide name="Send" className="h-6 w-6 mr-2" />
                </Button>
            </form>
        </Form>
    );
}