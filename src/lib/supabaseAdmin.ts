// lib/supabaseAdmin.ts

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Session } from 'next-auth';
import jwt from 'jsonwebtoken';

export function createAuthenticatedSupabaseClient(session: Session): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseJwtSecret) {
    throw new Error('Supabase environment variables are not properly set.');
  }

  const userId = (session.user as any).id;
  if (!userId) {
    throw new Error('User ID not found in session.');
  }

  const payload = {
    sub: userId,
    role: (session.user as any).role || 'authenticated',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
  };

  const token = jwt.sign(payload, supabaseJwtSecret);

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  return supabase;
}