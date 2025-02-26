import { createContext, ReactNode, JSX, useState, useEffect, useContext } from "react"

import toast from "react-hot-toast";
import { getTokenID } from "../actions/getToken";

interface SocketContexType {
    socket: WebSocket | null
    loading: boolean,
    isJoined: boolean,
    joinRoom: (roomId: string) => void;
}

export const SocketContext = createContext<SocketContexType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }): JSX.Element {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [loading, setLoading] = useState(true);
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            const token = await getTokenID()
            if (!token) {
                toast.error("token not found", { duration: 1000 });
                return
            }
            const wsUrl = process.env.NODE_ENV === 'production' ? `` : `ws://localhost:7077?token=${token}`
            const ws = new WebSocket(wsUrl)

            ws.onopen = () => {
                setSocket(ws)
                setLoading(false)
            }

            ws.onclose = () => {
                console.log("Socket closed")
            }
        }
        initialize();
        return () => socket?.close()
    }, [])

    const joinRoom = (roomId: string) => {
        if (socket) {
            socket.send(JSON.stringify({ type: "join_room", roomId }));
        }
    };


    return (
        <SocketContext.Provider
            value={{ socket, loading, isJoined, joinRoom }}
        >
            {children}
        </SocketContext.Provider>
    );

}
export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
}