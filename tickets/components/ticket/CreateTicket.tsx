'use client'

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import TextEditor from "../editor/TextEditor";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const formSchema = z.object({
    title: z.string().min(1, { message: "Title must be at least 1 character" }).max(255, { message: "Title must be at most 255 characters" }),
    body: z.string().min(1, { message: "Body must be at least 1 character" }),
});

export default function CreateTicket({ user }: any) {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            body: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!user) {
            return toast.error("You must be logged in to create a ticket", {
                description: "You must be logged in to create a ticket",
            });
        }
        await fetch("/api/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: values.title,
                body: values.body,
                username: user.username,
                userId: user.id,
            }),
        }).then((res) => {
            toast.success("Ticket created successfully", {
                description: "Your ticket has been created successfully",
            });
            form.reset();
        });
    }

    return (
        <div className="flex flex-col p-24">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-3xl font-bold">Title</FormLabel>
                                <FormControl>
                                    <Input className="bg-primary-foreground/50 backdrop-blur-sm focus-visible:ring-0 rounded-none" placeholder="Title for the blog" {...field} required />
                                </FormControl>
                                <FormDescription className={`text-sm ${field.value.length > 255 ? "text-red-400" : "text-gray-500"} ${field.value.length >= 1 ? 'text-green-700' : ''}`}>
                                    {field.value.length}/255
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="body"
                        render={({ field }: any) => (
                            <FormItem>
                                <FormLabel className="text-3xl font-bold">Body</FormLabel>
                                <FormControl>
                                    <TextEditor {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Form>
        </div>
    )
}
