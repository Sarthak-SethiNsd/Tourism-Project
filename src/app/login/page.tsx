import { AuthenticationExperience, type AuthenticationMode } from "@/features/authentication/authentication-experience";

type LoginPageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { mode } = await searchParams;
  const initialMode: AuthenticationMode = mode === "signup" ? "signup" : "signin";

  return <AuthenticationExperience initialMode={initialMode} />;
}
