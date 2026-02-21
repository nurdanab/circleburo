import ProjectSection from "@/components/shared/home/projectsSection/Project";
import { PROJECTS } from "@/lib/constants";
import { setRequestLocale } from "next-intl/server";
import styles from "./project.module.scss";

type Props = { params: Promise<{ locale: string }> };

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className={styles.projectWrapper}>
      <ProjectSection PROJECTS={PROJECTS} />
    </div>
  );
}
