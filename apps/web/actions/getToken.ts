"use server";
import { cookies } from "next/headers";
type CookieType = { name: string; value: string } | null;

export async function getTokenID() {
  if (process.env.NODE_ENV === "production") {
    const cookie = (await cookies()).get(
      "__Secure-next-auth.session-token",
    ) as unknown as CookieType;
    return cookie?.value;
  } else {
    const cookie = (await cookies()).get(
      "next-auth.session-token",
    ) as unknown as CookieType;
    return cookie?.value;
  }
}
