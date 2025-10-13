import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";

export default function About() {
  const educationData = [
    {
      year: "2023 - 2026",
      institution: "Politeknik Negeri Malang",
      degree: "D3 Teknologi Informasi",
      organizations: ["Himpunan Mahasiswa Teknologi Informasi (HMTI)"],
      current: true
    },
    {
      year: "2020 - 2023",
      institution: "SMK Nahdlatul Thalabah",
      degree: "Sekolah Menengah Kejuruan",
      organizations: [],
      current: false
    },
    {
      year: "2017 - 2020",
      institution: "MTs Nahdlatul Thalabah",
      degree: "Madrasah Tsanawiyah",
      organizations: ["OSIS - Koordinator Kesenian"],
      current: false
    }
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

      <div className="space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Tentang Saya
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">
            Mari berkenalan lebih dekat
          </p>
        </div>

        {/* About Me Card */}
        <Card className="mx-auto max-w-4xl border-border">
          <CardContent className="p-6 md:p-8 lg:p-12">
            <div className="space-y-4 md:space-y-6">
              <p className="text-base md:text-lg text-foreground leading-relaxed">
                Halo! Saya <span className="font-bold text-primary">Syn_Taxx</span>, seorang
                developer yang suka ngulik coding, belajar hal baru, dan membangun
                aplikasi seru 🚀.
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Perjalanan saya di dunia programming dimulai dari rasa penasaran yang tinggi
                terhadap bagaimana aplikasi dan website bekerja. Dari situ, saya mulai
                eksplorasi berbagai teknologi, dari web development, mobile apps, hingga
                security. Moto saya adalah
                <span className="italic font-medium text-foreground"> "ngoding dulu, jagonya belakangan."</span>
              </p>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Saya percaya bahwa setiap baris kode adalah kesempatan untuk belajar sesuatu
                yang baru dan menciptakan sesuatu yang bermanfaat.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Education Timeline */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Perjalanan Pendidikan
            </h3>
            <p className="text-sm md:text-base text-muted-foreground">
              Jejak akademik dan organisasi
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line - Desktop Only */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary transform -translate-x-1/2"></div>
            
            <div className="space-y-8 md:space-y-12">
              {educationData.map((edu, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline Dot - Desktop Only */}
                  <div className="hidden lg:flex absolute left-1/2 top-8 w-4 h-4 rounded-full bg-primary border-4 border-background transform -translate-x-1/2 z-10 shadow-lg"></div>
                  
                  {/* Content Card */}
                  <div className={`lg:grid lg:grid-cols-2 lg:gap-8 ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Year Badge - Desktop */}
                    <div className={`hidden lg:flex items-center ${idx % 2 === 0 ? 'justify-end pr-12' : 'lg:col-start-2 justify-start pl-12'}`}>
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
                        <span className="text-sm font-bold text-primary">{edu.year}</span>
                        {edu.current && (
                          <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                            Sekarang
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Education Card */}
                    <div className={idx % 2 === 0 ? 'lg:col-start-2' : 'lg:col-start-1 lg:row-start-1'}>
                      <Card className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                        <CardContent className="p-5 md:p-6">
                          {/* Mobile Year Badge */}
                          <div className="flex items-center gap-2 mb-4 lg:hidden">
                            <span className="text-sm font-bold text-primary">{edu.year}</span>
                            {edu.current && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded-full">
                                Sekarang
                              </span>
                            )}
                          </div>
                          
                          {/* Institution */}
                          <div className="flex items-start gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0 mt-1">
                              <GraduationCap className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-lg md:text-xl font-bold text-foreground mb-1 leading-tight">
                                {edu.institution}
                              </h4>
                              <p className="text-sm md:text-base text-muted-foreground">
                                {edu.degree}
                              </p>
                            </div>
                          </div>
                          
                          {/* Organizations */}
                          <div className="mt-4 pt-4 border-t border-dashed border-border">
                            <div className="flex items-start gap-2">
                              <Users className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs md:text-sm font-semibold text-foreground mb-1">
                                  Organisasi:
                                </p>
                                {edu.organizations.length > 0 ? (
                                  <ul className="space-y-1">
                                    {edu.organizations.map((org, orgIdx) => (
                                      <li key={orgIdx} className="text-xs md:text-sm text-muted-foreground flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span className="flex-1">{org}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs md:text-sm text-muted-foreground italic">
                                    Tidak ada organisasi
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech Stack Marquee */}
        <div className="space-y-6">
          <h3 className="text-2xl md:text-3xl font-bold text-center text-foreground">
            Tech Stack & Tools
          </h3>
          
          <div className="relative overflow-hidden bg-card border border-border rounded-lg py-6 md:py-8">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none"></div>
            
            {/* Marquee Container */}
            <div className="flex whitespace-nowrap animate-marquee">
              {duplicatedTechStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center mx-2 md:mx-4 px-3 md:px-5 py-2 md:py-3 bg-muted/50 rounded-lg hover:bg-muted transition-all duration-300 group"
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-background rounded-lg p-1.5 md:p-2 group-hover:scale-110 transition-transform duration-300">
                      <img 
                        src={tech.logo} 
                        alt={tech.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-foreground text-xs md:text-sm">
                        {tech.name}
                      </div>
                      <div className="text-[10px] md:text-xs text-muted-foreground">
                        {tech.category}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-center text-xs md:text-sm text-muted-foreground italic">
            Hover untuk pause • Scroll otomatis berjalan ke kiri
          </p>
        </div>

        {/* Quote Card */}
        <Card className="mx-auto max-w-3xl bg-muted/30 border-border">
          <CardContent className="p-6 md:p-8 text-center">
            <blockquote className="text-lg md:text-xl lg:text-2xl font-medium text-foreground italic leading-relaxed">
              "Kode yang baik adalah kode yang bisa dibaca dan dipahami oleh manusia, 
              bukan hanya mesin."
            </blockquote>
            <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground">— Syn_Taxx</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}