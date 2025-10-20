"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building, Mail, Users } from "lucide-react";

interface ProfileData {
  name: string;
  login: string;
  avatarUrl: string;
  bio: string | null;
  company: string | null;
  email: string | null;
  followers: { totalCount: number };
  following: { totalCount: number };
}

export default function ProfileCard() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/github?type=profile');
        const data = await response.json();
        
        if (data.data?.user) {
          setProfile(data.data.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <aside className="space-y-5">
        <div className="h-64 w-64 lg:h-96 lg:w-full bg-muted animate-pulse rounded-full" />
        <div className="space-y-2">
          <div className="h-8 bg-muted animate-pulse rounded w-3/4" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-5">
      {/* Avatar dan Nama */}
      <div className="relative">
        <Avatar className="h-64 w-64 rounded-full border-2 border-border lg:h-auto lg:w-full">
          <AvatarImage 
            src={profile?.avatarUrl || "/assets/avatar.jpg"} 
            alt="Profile Avatar" 
          />
          <AvatarFallback>
            {profile?.name?.substring(0, 2).toUpperCase() || "ST"}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">
          {profile?.name || "Assyifaul Izza"}
        </h1>
      </div>

      <Button variant="outline" className="w-full">
        Edit profile
      </Button>

      <Separator />

      {/* Info Detail */}
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Users className="h-4 w-4 flex-shrink-0" />
          <span>
            <span className="font-semibold text-foreground">
              {profile?.followers.totalCount || 0}
            </span> followers
            <span className="mx-1">•</span>
            <span className="font-semibold text-foreground">
              {profile?.following.totalCount || 0}
            </span> following
          </span>
        </div>
        {profile?.company && (
          <div className="flex items-center gap-3">
            <Building className="h-4 w-4 flex-shrink-0" />
            <span className="font-semibold text-foreground">{profile.company}</span>
          </div>
        )}
        {profile?.email && (
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="font-semibold text-foreground">{profile.email}</span>
          </div>
        )}
      </div>
    </aside>
  );
}