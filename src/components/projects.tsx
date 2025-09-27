
//projects.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Hotel Booking App",
    description: "Aplikasi booking hotel dengan fitur admin dan user.",
    link: "https://github.com/username/hotel-booking",
    tags: ["Next.js", "React", "Node.js"]
  },
  {
    title: "RFID Absensi",
    description: "Project absensi siswa berbasis RFID dengan Next.js.",
    link: "https://github.com/username/rfid-absensi",
    tags: ["Next.js", "RFID", "IoT"]
  },
  {
    title: "Portfolio Website",
    description: "Website portfolio pribadi menggunakan Next.js + Tailwind.",
    link: "#",
    tags: ["Next.js", "Tailwind", "React"]
  },
];


export default function Projects() {
  return (
    <section id="projects" className="max-w-5xl mx-auto px-4 py-20 bg-slate-50/50 dark:bg-slate-950/50">
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Project Saya
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Beberapa project yang telah saya kerjakan untuk mengasah skill dan berbagi dengan komunitas.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <Card key={index} className="border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-slate-100">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400">
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <Badge 
                      key={tagIndex} 
                      variant="secondary" 
                      className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    {project.link.includes('github') ? (
                      <>
                        <Github className="h-4 w-4" />
                        Lihat di GitHub
                      </>
                    ) : (
                      <>
                        <ExternalLink className="h-4 w-4" />
                        Lihat Project
                      </>
                    )}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}