// /app/api/revalidate/route.ts
import { revalidateRoomsTag } from "@/actions/revalidate";
import { NextResponse } from "next/server";

export async function POST() {
  await revalidateRoomsTag();
    console.log("HELLLO CAME FOR REVALIDATRE")
  return NextResponse.json({ success: true });
}
