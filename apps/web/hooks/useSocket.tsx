/* eslint-disable react-hooks/exhaustive-deps */

import {
  createContext,
  ReactNode,
  JSX,
  useState,
  useEffect,
  useContext,
} from "react";
import toast from "react-hot-toast";
import { getTokenID } from "../actions/getToken";
import {FromWebSocketMessages} from "@repo/common/type"
import { CreateRoom } from "@repo/common/type"


interface SocketContexType {
  socket: WebSocket | null;
  loading: boolean;
  isJoined: boolean;
  joinRoom: ({
    type,
    roomId,
    roomTitle,
    roomPassword,
    accessToken,
  }: CreateRoom) => void;
}

export const SocketContext = createContext<SocketContexType | undefined>(
  undefined,
);

export function SocketProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [loading, setLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      const token = await getTokenID();
      if (!token) {
        toast.error("token not found", { duration: 1000 });
        return;
      }
      const wsUrl =
        process.env.NODE_ENV === "production"
          ? `ws://localhost:7077?token=${token}`
          : `ws://localhost:7077?token=${token}`;
      const ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data) as unknown as FromWebSocketMessages;
        if(data.type === "joined"){
          setIsJoined(true)
        }
      }

      ws.onopen = () => {
        setSocket(ws);
        setLoading(false);
      };

      ws.onclose = () => {
        console.log("Socket closed");
      };
    };
    initialize();
    return () => socket?.close();
  }, []);

  const joinRoom = ({ type, roomId, roomTitle, roomPassword, accessToken }: CreateRoom) => {
    const roomMsg = {
      type,
      roomId,
      roomTitle,
      roomPassword,
      accessToken
    };
    if (socket) {
      socket.send(JSON.stringify(roomMsg));
    }
  };

  return (
    <SocketContext.Provider value={{ socket, loading, isJoined, joinRoom }}>
      {children}
    </SocketContext.Provider>
  );
}
export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
