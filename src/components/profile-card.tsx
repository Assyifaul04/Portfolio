import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building, Mail, Users } from "lucide-react";

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio: string | null;
  company: string | null;
  email: string | null;
  followers: number;
  following: number;
  html_url: string;
}

async function getGitHubUser(): Promise<GitHubUser | null> {
  try {
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      console.error("GITHUB_TOKEN tidak ditemukan di .env.local");
      return null;
    }

    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Cache selama 1 jam
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    return null;
  }
}

export default async function ProfileCard() {
  const user = await getGitHubUser();

  // Fallback data jika API gagal
  const displayData = {
    name: user?.name || "Assyifaul Izza",
    avatar: user?.avatar_url || "/assets/avatar.jpg",
    username: user?.login || "assyifaulizza",
    company: user?.company || "@polinema",
    email: user?.email || "tapirizza@gmail.com",
    followers: user?.followers || 4,
    following: user?.following || 4,
    initials: user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "ST",
  };

  return (
    <aside className="space-y-5">
      {/* Avatar dan Nama */}
      <div className="relative">
        <Avatar className="h-64 w-64 rounded-full border-2 border-border lg:h-auto lg:w-full">
          <AvatarImage src={displayData.avatar} alt="Profile Avatar" />
          <AvatarFallback>{displayData.initials}</AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">{displayData.name}</h1>
      </div>

      <Button variant="outline" className="w-full" asChild>
        <a
          href={user?.html_url || `https://github.com/${displayData.username}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View GitHub Profile
        </a>
      </Button>

      <Separator />

      {/* Info Detail */}
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-3">
          <Users className="h-4 w-4 flex-shrink-0" />
          <span>
            <span className="font-semibold text-foreground">
              {displayData.followers}
            </span>{" "}
            followers
            <span className="mx-1">•</span>
            <span className="font-semibold text-foreground">
              {displayData.following}
            </span>{" "}
            following
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Building className="h-4 w-4 flex-shrink-0" />
          <span className="font-semibold text-foreground">
            {displayData.company}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 flex-shrink-0" />
          <span className="font-semibold text-foreground">
            {displayData.email}
          </span>
        </div>
      </div>
    </aside>
  );
}