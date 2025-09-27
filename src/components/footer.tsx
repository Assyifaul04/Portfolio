//footer.tsx
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950">
      <Separator className="bg-slate-200 dark:bg-slate-800" />
      <div className="py-6 text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Syn_Taxx. Dibuat dengan ❤️ pakai Next.js &
          TailwindCSS.
        </p>
      </div>
    </footer>
  );
}
