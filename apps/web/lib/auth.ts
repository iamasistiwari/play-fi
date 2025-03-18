import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@repo/db/index";
import bcrypt from "bcrypt";
import { Credentials } from "../types/next-auth";
import { JWT } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import SpotifyProvider from "next-auth/providers/spotify"
import GoogleProvider from "next-auth/providers/google"

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

const params = new URLSearchParams({
  client_id: process.env.SPOTIFY_CLIENT!,
  response_type: "code",
  redirect_uri: process.env.NEXTAUTH_URL + "/api/auth/callback/spotify",
  scope: scopes,
  prompt: "login",
  show_dialog: "true",
});

const LOGIN_URL = `https://accounts.spotify.com/authorize?${params.toString()}`;


async function refreshToken(token: JWT) {
  const params = new URLSearchParams()
  params.append("grant_type", "refresh_token")
  params.append("refresh_token", token.refreshToken!)

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
  secret: process.env.NEXTAUTH_SECRET,
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
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT!,
      clientSecret: process.env.SPOTIFY_SECRET!,
      authorization: LOGIN_URL,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "spotify") {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
        return token;
      }
      if (account?.provider === "credentials") {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        return token;
      }
      if (account?.provider === "google") {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        return token;
      }
      if (token.accessToken && token.accessTokenExpires) {
        if (Date.now() > token.accessTokenExpires * 1000) {
          return await refreshToken(token);
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        if (token.accessToken) {
          session.user.accessToken = token.accessToken;
        }
      }
      return session;
    },
  },
};

