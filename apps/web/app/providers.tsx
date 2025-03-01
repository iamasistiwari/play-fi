"use client";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "../hooks/useSocket";


export default function Provider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const shouldUseSocket = pathname !== "/" && pathname !== "/offline";
    return shouldUseSocket ? (
        <SocketProvider>
            <Toaster position="top-right" reverseOrder={false} />
            {children}
        </SocketProvider>
    ) : (
        <>
            <Toaster position="top-right" reverseOrder={false} />
            {children}
        </>
    );
}
