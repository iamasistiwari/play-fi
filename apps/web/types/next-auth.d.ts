import type { User } from "next-auth";
type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    accessToken: string | undefined;
    refreshToken: string | undefined;
    accessTokenExpires: number | undefined;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
      accessToken: string | undefined;
    };
  }
}

interface Credentials {
  name?: string;
  email: string;
  password: string;
}
