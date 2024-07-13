"use client";

import type { ButtonProps } from "@/components/ui/button";
import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { LoadingButton } from "./loading-button";

const SubmitButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, children, ...props }, ref) => {
        const { pending } = useFormStatus();
        return (
            <LoadingButton
                ref={ref}
                {...props}
                loading={pending}
                className={className}
            >
                {children}
            </LoadingButton>
        );
    },
);
SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
