import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Smartphone, Shield, Palette } from "lucide-react";

export default function About() {
  const expertise = [
    {
      icon: <Code2 className="h-6 w-6" />,
      title: "Web Developer",
      desc: "Membangun aplikasi web modern dengan fokus pada performa dan UX",
    },
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Mobile Developer",
      desc: "Mengembangkan aplikasi mobile cross-platform dengan Flutter",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Ethical Hacking",
      desc: "Memahami keamanan siber dan penetration testing",
    },
    {
      icon: <Palette className="h-6 w-6" />,
      title: "UI/UX Enthusiast",
      desc: "Menciptakan interface yang intuitif dan menarik",
    },
  ];

  const techStack = [
    // Frontend
    { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", category: "Frontend" },
    { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", category: "Frontend" },
    { name: "Tailwind", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", category: "Frontend" },
    { name: "Laravel", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg", category: "Frontend" },
    
    // Backend
    { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", category: "Backend" },
    { name: "Express", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", category: "Backend" },
    { name: "Spring Boot", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg", category: "Backend" },
    { name: "PHP", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg", category: "Backend" },
    { name: "Golang", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg", category: "Backend" },
    
    // Mobile
    { name: "Flutter", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg", category: "Mobile" },
    
    // Database
    { name: "PostgreSQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg", category: "Database" },
    { name: "MySQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", category: "Database" },
    
    // Tools
    { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", category: "Tools" },
    { name: "VS Code", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", category: "Tools" },
    { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", category: "Tools" },
  ];

  // Duplicate for infinite scroll (triple untuk lebih smooth)
  const duplicatedTechStack = [...techStack, ...techStack, ...techStack];

  return (
    <section id="about" className="max-w-7xl mx-auto px-4 py-20 bg-background">
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          will-change: transform;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Tentang Saya
          </h2>
          <p className="text-muted-foreground text-lg">
            Mari berkenalan lebih dekat
          </p>
        </div>

        {/* About Me Card */}
        <Card className="mx-auto max-w-4xl border-border">
          <CardContent className="p-8 md:p-12">
            <div className="space-y-6">
              <p className="text-lg text-foreground leading-relaxed">
                Halo! Saya <span className="font-bold text-primary">Syn_Taxx</span>, seorang
                developer yang suka ngulik coding, belajar hal baru, dan membangun
                aplikasi seru 🚀.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Perjalanan saya di dunia programming dimulai dari rasa penasaran yang tinggi
                terhadap bagaimana aplikasi dan website bekerja. Dari situ, saya mulai
                eksplorasi berbagai teknologi, dari web development, mobile apps, hingga
                security. Moto saya adalah
                <span className="italic font-medium text-foreground"> "ngoding dulu, jagonya belakangan."</span>
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Saya percaya bahwa setiap baris kode adalah kesempatan untuk belajar sesuatu
                yang baru dan menciptakan sesuatu yang bermanfaat.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Expertise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertise.map((item, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow border-border">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tech Stack Marquee */}
        <div className="space-y-6">
          <h3 className="text-3xl font-bold text-center text-foreground">
            Tech Stack & Tools
          </h3>
          
          <div className="relative overflow-hidden bg-card border border-border rounded-lg py-8">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none"></div>
            
            {/* Marquee Container */}
            <div className="flex whitespace-nowrap animate-marquee">
              {duplicatedTechStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center mx-4 px-5 py-3 bg-muted/50 rounded-lg hover:bg-muted transition-all duration-300 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center bg-background rounded-lg p-2 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={tech.logo} 
                        alt={tech.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground text-sm">
                        {tech.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tech.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground italic">
            Hover untuk pause • Scroll otomatis berjalan ke kiri
          </p>
        </div>

        {/* Quote Card */}
        <Card className="mx-auto max-w-3xl bg-muted/30 border-border">
          <CardContent className="p-8 text-center">
            <blockquote className="text-xl md:text-2xl font-medium text-foreground italic">
              "Kode yang baik adalah kode yang bisa dibaca dan dipahami oleh manusia, 
              bukan hanya mesin."
            </blockquote>
            <p className="mt-4 text-muted-foreground">— Syn_Taxx</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}