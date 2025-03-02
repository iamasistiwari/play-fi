"use client";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "../hooks/useSocket";
import { SessionProvider } from "next-auth/react";


export default function Provider({ children }: { children: React.ReactNode }) {
    // const pathname = usePathname();
    return (
      <>
        <SessionProvider>
        <Toaster position="top-right" reverseOrder={false} />
        {children}
        </SessionProvider>
      </>
    );
    // const shouldUseSocket = pathname !== "/" && pathname !== "/offline";
    // return shouldUseSocket ? (
    //     <SocketProvider>
            // <SessionProvider>
            //   <Toaster position="top-right" reverseOrder={false} />
            //   {children}
            // </SessionProvider>
    //     </SocketProvider>
    // ) : (
    //     <>
            // <SessionProvider>
            //   <Toaster position="top-right" reverseOrder={false} />
            //   {children}
            // </SessionProvider>
    //     </>
    // );
}
