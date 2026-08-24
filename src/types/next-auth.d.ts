import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accountType: "admin" | "customer";
      role?: "SUPER_ADMIN" | "MANAGER" | "STAFF";
      permissions?: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    accountType: "admin" | "customer";
    role?: "SUPER_ADMIN" | "MANAGER" | "STAFF";
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    accountType: "admin" | "customer";
    role?: "SUPER_ADMIN" | "MANAGER" | "STAFF";
    permissions?: string[];
  }
}
