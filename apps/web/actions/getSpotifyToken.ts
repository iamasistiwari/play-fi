"use server"
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function getSpotifyToken() {
    const token = await getServerSession(authOptions)
    return token?.user.accessToken
}
