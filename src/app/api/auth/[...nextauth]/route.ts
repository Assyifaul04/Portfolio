import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

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
  callbacks: {
    async signIn({ user }: { user: any }) {
      const { email, name, image } = user;
      if (!email) return false;

      const { data } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (!data) {
        await supabase.from("users").insert([
          { email, name, avatar_url: image, role: "user" },
        ]);
      } else {
        await supabase
          .from("users")
          .update({ name, avatar_url: image })
          .eq("email", email);
      }

      return true;
    },
    async session({ session }: { session: any }) {
      if (!session?.user?.email) return session;

      const { data } = await supabase
        .from("users")
        .select("role, avatar_url, id")
        .eq("email", session.user.email)
        .single();

      if (data) {
        (session.user as any).role = data.role;
        (session.user as any).id = data.id;
        session.user.image = data.avatar_url;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
