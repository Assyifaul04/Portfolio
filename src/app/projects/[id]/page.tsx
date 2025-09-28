import ProjectID from "@/components/projectID";

export default function ProjectPage() {
  return <ProjectID />;
}

// Optional: Generate metadata
export async function generateMetadata({ params }: { params: { projectId: string } }) {
  return {
    title: `Project ${params.projectId} - Detail`,
    description: `Detail lengkap untuk project ${params.projectId}`,
  };
}