import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@repo/db/index";
import bcrypt from "bcrypt";
import { Credentials } from "../types/next-auth";
import { JWT } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import SpotifyProvider from "next-auth/providers/spotify"


const scopes = [
  "user-read-email",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-currently-playing",
  "user-modify-playback-state",
  "user-read-playback-state",
  "streaming",
  "user-read-private",
  "app-remote-control",
].join(",");


const params = {
  scope: scopes
}

const LOGIN_URL = "https://accounts.spotify.com/authorize?" + new URLSearchParams(params).toString()

function getSecret() {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH SECRET NOT FOUND");
  }
  return secret;
}

async function refreshToken(token: JWT) {
  const params = new URLSearchParams()
  params.append("grant_type", "refresh_token")
  params.append("refresh_token", token.refreshToken)
  const response = await fetch(`https://accounts.spotify.com/api/token"`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from( process.env.SPOTIFY_CLIENT! + ":" + process.env.SPOTIFY_SECRET!).toString("base64"),
    },
    body: params,
  });
  const data = await response.json()
  return {
    ...token,
    accessToken: data.access_token as unknown as string,
    refreshToken: (data.refresh_token ?? token.refreshToken) as unknown as string,
    accessTokenExpires: Date.now() + data.expires_in * 1000 as unknown as number
  };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: getSecret(),
  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = account.access_token || ""
        token.refreshToken = account.refresh_token || ""
        token.accessTokenExpires = account.expires_at || 0
        return token
      }
      if(Date.now() < token.accessTokenExpires * 1000){
        return token
      }
      return await refreshToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.accessToken = token.accessToken || "";
      }
      return session;
    },
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET!,
    encode: async ({ token, secret }) => {
      return jwt.sign(token!, secret, { algorithm: "HS256" });
    },
    decode: async ({ token, secret }) => {
      return jwt.verify(token!, secret) as Promise<JWT | null>;
    },
  },

  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT!,
      clientSecret: process.env.SPOTIFY_SECRET!,
      authorization: LOGIN_URL
    }),
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        name: { label: "Name", type: "text", placeholder: "John Doe" },
        email: {
          label: "Email",
          type: "text",
          placeholder: "john@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Credentials | undefined) {
        if (!credentials) {
          throw new Error("Provide Credentials");
        }
        const { name, email, password } = credentials;
        if (!email || !password) {
          throw new Error("Provide Login Credentials");
        }

        const hashedPassword = await bcrypt.hash(credentials.password, 10);
        const existingUser = await prisma.user.findFirst({
          where: {
            email,
          },
        });
        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password,
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              email: existingUser.email,
            };
          }
          throw new Error("Incorrect Password");
        } else {
          if (!name) {
            throw new Error("User Not Found");
          }
          try {
            const user = await prisma.user.create({
              data: {
                email,
                name,
                password: hashedPassword,
              },
            });
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
            };
          } catch (e) {
            console.log(e);
            throw new Error("Error");
          }
        }
      },
    }),
  ],
};
