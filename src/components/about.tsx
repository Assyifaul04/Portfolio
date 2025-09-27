//about.tsx
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <section id="about" className="max-w-5xl mx-auto px-4 py-20">
      <div className="text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Tentang Saya
        </h2>
        <Card className="mx-auto max-w-3xl border-slate-200 dark:border-slate-800">
          <CardContent className="p-8">
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Halo! Saya <span className="font-semibold text-slate-800 dark:text-slate-200">Syn_Taxx</span>, seorang
              developer yang suka ngulik coding, belajar hal baru, dan membangun
              aplikasi seru 🚀. Moto saya adalah
              <span className="italic text-slate-700 dark:text-slate-300"> "ngoding dulu, jagonya belakangan."</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}