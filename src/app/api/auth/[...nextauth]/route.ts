import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseClient } from "@supabase/supabase-js";

const supabase = new SupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async signIn({ user }) {
      const { email, name } = user;

      // Cek apakah user sudah ada di DB
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (!data) {
        // Insert user baru default role = user
        await supabase.from("users").insert([
          { email, name, role: "user" },
        ]);
      }

      return true;
    },
    async session({ session }) {
      if (!session?.user?.email) return session;

      // Ambil role user dari DB
      const { data } = await supabase
        .from("users")
        .select("role")
        .eq("email", session.user.email)
        .single();

      if (data?.role) {
        (session.user as any).role = data.role;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
