// contactsapp/auth.ts
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { usersService } from "@nowcrm/services/server"
import { headers } from "next/headers";

import { parse } from "cookie"; // make sure you're using named import
import { env } from "./lib/config/envConfig";



export const { handlers, signIn, signOut, auth }: any = NextAuth({
  providers: [
    CredentialsProvider({ 
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      //@ts-ignore
      authorize: async (credentials, req) => {
          if (!credentials?.password) return null;

          // 🧪 Special flow: 2FA follow-up login
          if (credentials.password === "__2fa-token-auth__") {
            const headerStore = await headers();
            const rawCookieHeader = headerStore.get("cookie");

            if (!rawCookieHeader) {
              console.error("Missing cookie header during 2FA auth");
              return null;
            }

            const parsedCookies = parse(rawCookieHeader); // 🔥 FIXED: use correct raw cookie header
            const pendingUserId = parsedCookies.pendingLoginUserId;
            const pendingEmail = parsedCookies.pendingLoginEmail;

            console.log("Completing 2FA login for:", { pendingEmail, pendingUserId });

            if (!pendingUserId || !pendingEmail) {
              console.error("2FA login blocked: cookies missing values");
              return null;
            }


            const user = await usersService.getById(Number(pendingUserId),env.CRM_STRAPI_API_TOKEN);
            if (!user || user.email !== pendingEmail) {
              console.error("2FA login blocked: user mismatch or not found");
              return null;
            }


            const rawId = (user as any).strapi_id ?? user.id;

            return {
              ...user,
              id: rawId.toString(),
            };
          }

          // ✅ Normal login flow
          if (!credentials?.email || !credentials?.password) return null;

          const loginRes = await usersService.login({
            identifier: credentials.email as string,
            password: credentials.password as string,
            token: env.CRM_STRAPI_API_TOKEN,
          });

          if (!loginRes.success || !loginRes.data?.user) {
            throw new Error(loginRes.errorMessage || "Login failed");
          }
          const user = loginRes.data.user;

          if (user && (!user.is2FAEnabled || !user.totpSecret)) {
            return user; // 👈 Normal user login, return user
          }

          // ❌ 2FA is required, block here so client redirects to 2FA screen
          console.error("[AUTH] 2FA required. Returning null.");
          return null;
        },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/unauthorized",
  },
 callbacks: {
    jwt: async ({ token }) => {
      const {usersService} = await import('@nowcrm/services/server')
      const searchRes = await usersService.find(
        env.CRM_STRAPI_API_TOKEN,
        {
          populate: ["role", "image"],
          filters: ({ email: token.email }) as any, //any here is because of not normal behaviour of user permission routes on strapi,
        }
      );
      if (
        searchRes.data &&
        searchRes.data.length > 0 &&
        !searchRes.data[0].jwt_token
      ) {
        return null
      } else {
        if (searchRes.data && searchRes.data.length > 0) {
          token.role = searchRes.data[0].role.name;
          token.strapi_jwt = searchRes.data[0].jwt_token;
          token.username = searchRes.data[0].username
          token.strapi_id = searchRes.data[0].id
          token.twoFARequired = searchRes.data[0].is2FAEnabled
          token.image = searchRes.data[0].image;
        }
      }
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role || "";
      session.jwt = (token.strapi_jwt as string) || "";
      session.user.username = (token.username as string) || "";
      session.user.strapi_id = (token.strapi_id as number);
      session.user.twoFARequired = (token.twoFARequired as boolean);
      session.user.image = token.image;
      return session;
    },
  },

});
