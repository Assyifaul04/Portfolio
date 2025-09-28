// "use client";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Download, ArrowLeft, Calendar, Star, Eye } from "lucide-react";
// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { useRouter, useParams } from "next/navigation";

// export default function ProjectID() {
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedFile, setSelectedFile] = useState(false);
//   const router = useRouter();
//   const params = useParams();
//   const projectId = params.projectId;

//   // Status persyaratan social media
//   const [requirements, setRequirements] = useState({
//     instagram: false,
//     tiktok: false,
//     youtube: false,
//   });

//   const allCompleted = Object.values(requirements).every(Boolean);

//   useEffect(() => {
//     // Simulasi fetch data project
//     setTimeout(() => {
//       const mockProject = {
//         id: projectId,
//         name: `Amazing Project ${projectId}`,
//         description: "Proyek web modern dengan fitur lengkap dan desain responsif",
//         longDescription: `Ini adalah proyek web yang dikembangkan dengan teknologi terdepan. 
//         Proyek ini mencakup sistem autentikasi, dashboard admin, dan API RESTful. 
//         Cocok untuk developer yang ingin mempelajari arsitektur web modern.`,
//         size: 15672832, // 15.67 MB
//         uploadDate: "2024-01-15",
//         tags: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
//         downloadCount: 1247,
//         viewCount: 3891,
//         rating: 4.8,
//         author: "Developer Pro",
//         version: "2.1.0",
//         features: [
//           "Sistem autentikasi JWT",
//           "Dashboard admin lengkap",
//           "UI/UX modern dan responsif", 
//           "Optimasi performa tinggi",
//           "SEO friendly",
//           "Dark/Light mode"
//         ],
//         requirements: [
//           "Node.js 18+",
//           "npm atau yarn",
//           "PostgreSQL 13+",
//           "Git"
//         ]
//       };
      
//       setProject(mockProject);
//       setLoading(false);
//     }, 1000);
//   }, [projectId]);

//   const handleDownload = async () => {
//     if (!project) return;
    
//     try {
//       // Simulasi download
//       toast.success("Download berhasil!");
//       setRequirements({ instagram: false, tiktok: false, youtube: false });
//       setSelectedFile(false);
//     } catch (err) {
//       toast.error("Gagal download: " + err.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading project...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!project) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Proyek tidak ditemukan</h2>
//           <Button onClick={() => router.back()} variant="outline">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Kembali
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-4xl mx-auto px-4 py-4">
//           <Button onClick={() => router.back()} variant="ghost">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Kembali ke Proyek
//           </Button>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 py-8">
//         {/* Project Header */}
//         <Card className="mb-8">
//           <CardHeader>
//             <div className="flex flex-col md:flex-row gap-6">
//               <div className="flex-1">
//                 <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.name}</h1>
//                 <p className="text-lg text-gray-600 mb-4">{project.description}</p>
                
//                 {/* Tags */}
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {project.tags.map((tag, index) => (
//                     <Badge key={index} className="bg-blue-100 text-blue-800">
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>

//                 {/* Stats */}
//                 <div className="flex flex-wrap gap-6 text-sm text-gray-600">
//                   <div className="flex items-center gap-2">
//                     <Download className="h-4 w-4" />
//                     <span>{project.downloadCount.toLocaleString()} downloads</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Eye className="h-4 w-4" />
//                     <span>{project.viewCount.toLocaleString()} views</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                     <span>{project.rating}/5</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4" />
//                     <span>{new Date(project.uploadDate).toLocaleDateString("id-ID")}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </CardHeader>
//         </Card>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Description */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Deskripsi</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-700 leading-relaxed">{project.longDescription}</p>
//               </CardContent>
//             </Card>

//             {/* Features */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Fitur Utama</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid md:grid-cols-2 gap-3">
//                   {project.features.map((feature, index) => (
//                     <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                       <span className="text-sm">{feature}</span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Installation */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Panduan Instalasi</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
//                   <div className="space-y-1">
//                     <div># 1. Extract project</div>
//                     <div>$ cd {project.name.toLowerCase().replace(/\s+/g, '-')}</div>
//                     <div></div>
//                     <div># 2. Install dependencies</div>
//                     <div>$ npm install</div>
//                     <div></div>
//                     <div># 3. Run development server</div>
//                     <div>$ npm run dev</div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Download */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Download Project</CardTitle>
//                 <p className="text-sm text-gray-600">
//                   Ukuran: {(project.size / 1024 / 1024).toFixed(1)} MB
//                 </p>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {!selectedFile ? (
//                   <Button
//                     onClick={() => setSelectedFile(true)}
//                     className="w-full bg-green-600 hover:bg-green-700"
//                   >
//                     <Download className="h-4 w-4 mr-2" />
//                     Download Sekarang
//                   </Button>
//                 ) : (
//                   <div className="space-y-3">
//                     <p className="text-sm font-medium text-center">Selesaikan persyaratan:</p>
                    
//                     {[
//                       { key: 'instagram', url: 'https://instagram.com/username', label: '📸 Follow Instagram' },
//                       { key: 'tiktok', url: 'https://tiktok.com/@username', label: '🎵 Follow TikTok' },
//                       { key: 'youtube', url: 'https://youtube.com/channel/yourchannel', label: '🎬 Subscribe YouTube' }
//                     ].map(({ key, url, label }) => (
//                       <a
//                         key={key}
//                         href={url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className={`
//                           block w-full p-2 rounded text-center text-sm font-medium transition-colors
//                           ${requirements[key] 
//                             ? 'bg-green-100 text-green-800 border border-green-300' 
//                             : 'bg-blue-500 text-white hover:bg-blue-600'
//                           }
//                         `}
//                         onClick={() => setRequirements(prev => ({ ...prev, [key]: true }))}
//                       >
//                         {requirements[key] ? `✅ ${label}` : label}
//                       </a>
//                     ))}

//                     <Button
//                       onClick={handleDownload}
//                       className={`w-full ${
//                         allCompleted 
//                           ? 'bg-green-600 hover:bg-green-700' 
//                           : 'bg-gray-400 cursor-not-allowed'
//                       }`}
//                       disabled={!allCompleted}
//                     >
//                       {allCompleted ? "🚀 Download!" : "Selesaikan dulu"}
//                     </Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Project Info */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Informasi Project</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Author:</span>
//                   <span className="font-medium">{project.author}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Version:</span>
//                   <span className="font-medium">{project.version}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Upload:</span>
//                   <span className="font-medium">
//                     {new Date(project.uploadDate).toLocaleDateString("id-ID")}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Downloads:</span>
//                   <span className="font-medium">{project.downloadCount.toLocaleString()}</span>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Requirements */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Persyaratan Sistem</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2">
//                   {project.requirements.map((req, index) => (
//                     <li key={index} className="flex items-center gap-2 text-sm">
//                       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                       <span>{req}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }