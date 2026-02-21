import { redirect } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function ShowCasesPage({ params }: Props) {
  const { locale } = await params;
  redirect({ href: "/show-cases/design", locale: locale as "ru" | "en" | "kz" | "zh" });
}
