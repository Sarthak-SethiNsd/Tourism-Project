import { TourismOnboardingFlow } from "@/features/tourism/components/tourism-onboarding-flow";

type HomePageProps = {
  searchParams: Promise<{ step?: string }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const { step } = await searchParams;

  return <TourismOnboardingFlow initialStep={step === "state" ? "state" : "splash"} />;
}
