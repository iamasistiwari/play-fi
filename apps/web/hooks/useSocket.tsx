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
import { RoomMetadata } from "@repo/common/type";

interface SocketContexType {
  socket: WebSocket | null;
  loading: boolean;
  roomMetadata: RoomMetadata | undefined;
  SetRoomMetadata: (data: RoomMetadata) => void;
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
  const [roomMetadata, setRoomMetadata] = useState<RoomMetadata>();

  useEffect(() => {
    const initialize = async () => {
      const token = await getTokenID();
      if (!token) {
        toast.error("token not found", { duration: 1000 });
        return;
      }
      const wsUrl =
        process.env.NODE_ENV === "production"
          ? `ws://localhost:3014?token=${token}`
          : `ws://localhost:3014?token=${token}`;
      const ws = new WebSocket(wsUrl);

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

  const SetRoomMetadata = (data: RoomMetadata) => {
    setRoomMetadata(data);
  };

  return (
    <SocketContext.Provider
      value={{ socket, loading, SetRoomMetadata, roomMetadata }}
    >
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
