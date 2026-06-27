import { AppShell, Screen } from "@/components/AppShell";

type PageProps = {
  searchParams?: Promise<{
    screen?: string | string[];
  }>;
};

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const screenParam = Array.isArray(params?.screen) ? params?.screen[0] : params?.screen;
  const initialScreen: Screen = screenParam === "game" ? "game" : "home";

  return <AppShell initialScreen={initialScreen} />;
}
