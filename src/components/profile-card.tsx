import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building, Mail, Users } from "lucide-react";

export default function ProfileCard() {
  return (
    <aside className="space-y-5">
      {/* Avatar dan Nama */}
      <div className="relative">
        <Avatar className="h-64 w-64 rounded-full border-2 border-border lg:h-auto lg:w-full">
          <AvatarImage src="/assets/avatar.jpg" alt="Profile Avatar" />
          <AvatarFallback>ST</AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">@syn_taxx</h1>
        <p className="text-lg text-muted-foreground">Assyifaul04</p>
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
            <span className="font-semibold text-foreground">4</span> followers
            <span className="mx-1">•</span>
            <span className="font-semibold text-foreground">4</span> following
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Building className="h-4 w-4 flex-shrink-0" />
          <span className="font-semibold text-foreground">@polinema</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 flex-shrink-0" />
          <span className="font-semibold text-foreground">tapirizza@gmail.com</span>
        </div>
      </div>
    </aside>
  );
}