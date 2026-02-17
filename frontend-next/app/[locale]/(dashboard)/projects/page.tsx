import ProjectSection from "@/app/components/shared/home/projectsSection/Project";
import styles from "./project.module.scss";
import { PROJECTS } from "@/app/lib/constants";

export default function ProjectsPage() {
  return (
    <div className={styles.projectWrapper}>
      <ProjectSection PROJECTS={PROJECTS} />
    </div>
  );
}
