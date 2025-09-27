import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Mail } from "lucide-react";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-20">
      <div className="space-y-8 max-w-4xl">
        <div className="space-y-4">
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            Fullstack Learner & Ethical Hacking Enthusiast
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-slate-100">
            Hi, I'm{" "}
            <span className="text-slate-600 dark:text-slate-400">Syn_Taxx</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Ngoding dulu, jagonya belakangan 🚀
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            asChild
            size="lg"
            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900"
          >
            <a href="#projects" className="inline-flex items-center gap-2">
              <ArrowDown className="h-4 w-4" />
              Lihat Project
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <a href="#contact" className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Hubungi Saya
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
