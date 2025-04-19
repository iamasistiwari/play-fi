"use server";

import { revalidateTag } from "next/cache";

export async function revalidateRoomsTag() {
  revalidateTag("rooms");
}
