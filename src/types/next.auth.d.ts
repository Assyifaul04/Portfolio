import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  // Tambahkan field baru ke session.user
  interface Session {
    user: {
      id?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  // Tambahkan field baru ke User
  interface User extends DefaultUser {
    id?: string;
    role?: string;
  }
}
