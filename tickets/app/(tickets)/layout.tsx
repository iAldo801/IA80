import type { ReactNode } from "react";

const TicketsLayout = ({ children }: { children: ReactNode }) => {
    return (
        <main>{children}</main>
    );
};

export default TicketsLayout;