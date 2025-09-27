//contact.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="max-w-3xl mx-auto px-4 py-20">
      <div className="text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Hubungi Saya
        </h2>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-8 space-y-6">
            <p className="text-slate-600 dark:text-slate-400">
              Tertarik bekerja sama atau sekadar ngobrol? Yuk kontak saya lewat
              email.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:hover:bg-slate-200 dark:text-slate-900"
            >
              <a
                href="mailto:yourname@email.com"
                className="inline-flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Kirim Email
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
