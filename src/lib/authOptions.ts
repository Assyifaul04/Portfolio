import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

// Klien ini digunakan untuk operasi di sisi server (mis: sinkronisasi user)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // --- TAMBAHAN ---
  // Strategi sesi harus 'jwt' agar callback jwt bisa digunakan.
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // --- TAMBAHAN ---
    // Callback 'jwt' dipanggil pertama kali saat sign-in.
    // Di sinilah kita menangkap accessToken dari provider (Google).
    async jwt({ token, account }: { token: any, account: any }) {
      if (account) {
        // 'account.access_token' adalah token yang diberikan oleh Google.
        // Ini kita simpan ke dalam 'token' NextAuth.
        token.accessToken = account.access_token;
      }
      return token;
    },
    
    // KODE LAMA ANDA (signIn): Tidak diubah, tetap berfungsi seperti sebelumnya.
    async signIn({ user }: { user: any }) {
      const { email, name, image } = user;
      if (!email) return false;

      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (!data) {
        await supabase.from("users").insert([{ email, name, avatar_url: image, role: "user" }]);
      } else {
        await supabase
          .from("users")
          .update({ name, avatar_url: image })
          .eq("email", email);
      }

      return true;
    },

    // KODE LAMA ANDA (session): Sedikit dimodifikasi untuk menerima 'token' dari callback jwt.
    async session({ session, token }: { session: any, token: any }) {
      // --- TAMBAHAN ---
      // 'token.accessToken' yang kita simpan di callback jwt sekarang
      // kita teruskan ke objek 'session' agar bisa digunakan di client & API route.
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }

      // Bagian ini adalah kode lama Anda, tetap dipertahankan.
      if (!session?.user?.email) return session;

      const { data } = await supabase
        .from("users")
        .select("role, avatar_url, id")
        .eq("email", session.user.email)
        .single();

      if (data) {
        session.user.role = data.role;
        session.user.id = data.id;
        session.user.image = data.avatar_url;
      }

      return session;
    },
  },
};