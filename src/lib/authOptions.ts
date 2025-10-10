import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { NextAuthOptions } from "next-auth";

// Gunakan SERVICE_ROLE_KEY hanya untuk operasi admin seperti membuat user
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // WAJIB: Gunakan strategi JWT untuk session
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Cari atau buat user di tabel 'users' Anda
      const { data: userData, error } = await supabaseAdmin
        .from("users")
        .select("id, role")
        .eq("email", user.email)
        .single();
        
      if (error && error.code !== 'PGRST116') { // PGRST116 = baris tidak ditemukan
        console.error("Error fetching user:", error);
        return false;
      }

      let supabaseUserId: string;
      let userRole: string;

      if (!userData) {
        // User baru, buat di tabel 'users'
        const { data: newUser, error: insertError } = await supabaseAdmin
          .from("users")
          .insert({
            email: user.email,
            name: user.name,
            avatar_url: user.image,
            role: "user", // Default role
          })
          .select("id, role")
          .single();

        if (insertError || !newUser) {
          console.error("Error creating new user:", insertError);
          return false;
        }
        supabaseUserId = newUser.id;
        userRole = newUser.role;
      } else {
        // User sudah ada
        supabaseUserId = userData.id;
        userRole = userData.role;
      }

      // BUAT JWT SUPABASE SECARA MANUAL
      const payload = {
        aud: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // Token berlaku 7 hari
        sub: supabaseUserId,
        email: user.email,
        role: userRole,
      };

      const accessToken = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET!);
      
      // Kirim token ke callback 'jwt'
      (user as any).accessToken = accessToken;
      (user as any).role = userRole;

      return true;
    },

    async jwt({ token, user }) {
      // Saat pertama kali login, 'user' object dari signIn akan ada di sini
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.role = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      // Ambil data dari token dan kirim ke session
      session.accessToken = token.accessToken as string;
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};