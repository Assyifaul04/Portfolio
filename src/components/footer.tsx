import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/yourusername",
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/yourusername",
      icon: Linkedin,
    },
    {
      name: "Twitter",
      href: "https://twitter.com/yourusername",
      icon: Twitter,
    },
    {
      name: "Email",
      href: "mailto:your.email@example.com",
      icon: Mail,
    },
  ];

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          {/* Social Links */}
          <div className="flex justify-center items-center gap-6 mb-8">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors duration-200"
                aria-label={link.name}
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <Separator className="bg-slate-200 dark:bg-slate-800 mb-8" />

          {/* Copyright & Tech Stack */}
          <div className="space-y-2">
            <p className="text-sm text-center text-slate-600 dark:text-slate-400">
              © {currentYear} Syn_Taxx. All rights reserved.
            </p>
            <p className="text-xs text-center text-slate-500 dark:text-slate-500">
              Dibuat dengan{" "}
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                Next.js
              </span>
              ,{" "}
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                TailwindCSS
              </span>{" "}
              &{" "}
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                shadcn/ui
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}