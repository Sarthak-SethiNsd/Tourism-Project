"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, Compass, LogIn, MapPinned, Sparkles } from "lucide-react";
import { onboardingCopy, type SelectOption } from "@/config/tourism";
import { routes } from "@/config/routes";
import { DistrictDropdown } from "@/features/tourism/components/district-dropdown";
import { StateDropdown } from "@/features/tourism/components/state-dropdown";
import { useDistrictsByRegion } from "@/features/tourism/hooks/use-districts-by-region";
import { useIndianRegions } from "@/features/tourism/hooks/use-indian-regions";
import { buildExploreSearchParams } from "@/features/tourism/utils/explore-navigation";
import { districtsToSelectOptions, regionToSelectOption, regionsToSelectOptions } from "@/features/tourism/utils/region-mappers";
import { getRecentRegionOptions, saveRecentRegion } from "@/features/tourism/utils/recent-regions";
import { PrimaryButton } from "@/components/shared/primary-button";
import { ScreenContainer } from "@/components/shared/screen-container";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type OnboardingStep = "splash" | "login" | "state" | "district";

const stepOrder: OnboardingStep[] = ["splash", "login", "state", "district"];

const transition = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export function TourismOnboardingFlow() {
  const router = useRouter();
  const { regions, status: regionsStatus } = useIndianRegions();
  const [step, setStep] = useState<OnboardingStep>("splash");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [entireStateSelected, setEntireStateSelected] = useState(false);
  const [recentStates, setRecentStates] = useState<SelectOption[]>([]);

  const { districts, status: districtsStatus } = useDistrictsByRegion(selectedState || undefined);

  const stepIndex = stepOrder.indexOf(step);
  const regionOptions = useMemo(() => regionsToSelectOptions(regions), [regions]);
  const districtOptions = useMemo(() => districtsToSelectOptions(districts), [districts]);
  const selectedStateOption = useMemo(
    () => (selectedState ? regions.find((region) => region.id === selectedState) : undefined),
    [regions, selectedState],
  );
  const canExplore = Boolean(selectedState && (selectedDistrict || entireStateSelected));

  useEffect(() => {
    if (regions.length) {
      setRecentStates(getRecentRegionOptions(regions));
    }
  }, [regions]);

  function goToStep(nextStep: OnboardingStep) {
    setStep(nextStep);
  }

  function goBack() {
    const previous = stepOrder[Math.max(stepIndex - 1, 0)];
    setStep(previous);
  }

  function handleStateChange(value: string) {
    setSelectedState(value);
    setSelectedDistrict("");
    setEntireStateSelected(false);
    saveRecentRegion(value, regions);
    setRecentStates(getRecentRegionOptions(regions));
  }

  function handleExplore() {
    if (!canExplore) {
      return;
    }

    const searchParams = buildExploreSearchParams({
      regionId: selectedState,
      districtId: selectedDistrict || undefined,
      scope: entireStateSelected ? "state" : "district",
    });

    router.push(`${routes.explore}?${searchParams.toString()}`);
  }

  return (
    <main className="min-h-dvh overflow-hidden bg-background">
      <ScreenContainer className="relative justify-between gap-6 pb-7 pt-5">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-primary/10" />

        <header className="flex min-h-10 items-center justify-between">
          {stepIndex > 0 ? (
            <Button type="button" variant="ghost" size="icon" className="size-10 rounded-lg" onClick={goBack} aria-label="Go back">
              <ChevronLeft className="size-5" aria-hidden />
            </Button>
          ) : (
            <span className="size-10" aria-hidden />
          )}
          <div className="flex gap-1.5" aria-label={`Step ${stepIndex + 1} of ${stepOrder.length}`}>
            {stepOrder.map((item, index) => (
              <span
                key={item}
                className={cn("h-1.5 w-5 rounded-full bg-muted transition", index <= stepIndex && "bg-primary")}
              />
            ))}
          </div>
          <Button type="button" variant="ghost" className="h-10 px-3 text-sm" onClick={() => goToStep("state")}>
            Skip
          </Button>
        </header>

        <AnimatePresence mode="wait">
          {step === "splash" ? (
            <motion.section key="splash" {...transition} transition={{ duration: 0.28 }} className="flex flex-1 flex-col justify-between gap-6">
              <div className="pt-6 text-center">
                <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-accent text-lg font-bold text-accent-foreground shadow-sm">
                  IN
                </div>
                <h1 className="text-4xl font-semibold tracking-tight">{onboardingCopy.splashTitle}</h1>
                <p className="mx-auto mt-3 max-w-xs text-base leading-7 text-muted-foreground">{onboardingCopy.splashTagline}</p>
              </div>

              <div className="relative mx-auto aspect-square w-full max-w-[330px] overflow-hidden rounded-2xl bg-white shadow-sm">
                <Image
                  src="/images/india-tourism-splash-illustration.png"
                  alt="Illustrated India travel landscape"
                  fill
                  priority
                  sizes="(max-width: 640px) 90vw, 330px"
                  className="object-cover"
                />
              </div>

              <div className="grid gap-3">
                <PrimaryButton onClick={() => goToStep("login")}>Get Started</PrimaryButton>
                <Button type="button" variant="ghost" className="min-h-12 rounded-lg" onClick={() => goToStep("state")}>
                  Skip
                </Button>
              </div>
            </motion.section>
          ) : null}

          {step === "login" ? (
            <motion.section key="login" {...transition} transition={{ duration: 0.28 }} className="flex flex-1 flex-col justify-center gap-5">
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                  <LogIn className="size-4" aria-hidden />
                  Optional Login
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">Travel as yourself or as a guest.</h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">Authentication is optional. Guest users can continue normally.</p>
              </div>

              <Card className="shadow-sm">
                <CardContent className="grid gap-3 p-4">
                  <PrimaryButton onClick={() => goToStep("state")} showIcon={false}>
                    {onboardingCopy.guestLabel}
                  </PrimaryButton>
                  <Button type="button" variant="outline" className="min-h-12 rounded-lg" onClick={() => goToStep("state")}>
                    {onboardingCopy.googleLabel}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant="secondary" className="min-h-12 rounded-lg" onClick={() => goToStep("state")}>
                      {onboardingCopy.signInLabel}
                    </Button>
                    <Button type="button" variant="secondary" className="min-h-12 rounded-lg" onClick={() => goToStep("state")}>
                      {onboardingCopy.signUpLabel}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          ) : null}

          {step === "state" ? (
            <motion.section key="state" {...transition} transition={{ duration: 0.28 }} className="flex flex-1 flex-col gap-5">
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                  <Compass className="size-4" aria-hidden />
                  State Selection
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">{onboardingCopy.stateStepTitle}</h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{onboardingCopy.stateStepDescription}</p>
              </div>

              <StateDropdown
                states={regionOptions}
                recentStates={recentStates}
                value={selectedState}
                onChange={handleStateChange}
                isLoading={regionsStatus === "loading"}
              />

              <div className="mt-auto pt-2">
                <PrimaryButton disabled={!selectedState || regionsStatus !== "success"} onClick={() => goToStep("district")}>
                  Continue
                </PrimaryButton>
              </div>
            </motion.section>
          ) : null}

          {step === "district" ? (
            <motion.section key="district" {...transition} transition={{ duration: 0.28 }} className="flex flex-1 flex-col gap-5">
              <div>
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                  <MapPinned className="size-4" aria-hidden />
                  District Selection
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">
                  {selectedStateOption ? regionToSelectOption(selectedStateOption).label : "Selected region"}
                </h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{onboardingCopy.districtStepDescription}</p>
              </div>

              <DistrictDropdown
                districts={districtOptions}
                value={selectedDistrict}
                entireStateSelected={entireStateSelected}
                isLoading={districtsStatus === "loading"}
                onDistrictChange={(value) => {
                  setSelectedDistrict(value);
                  setEntireStateSelected(false);
                }}
                onEntireStateChange={() => {
                  setSelectedDistrict("");
                  setEntireStateSelected(true);
                }}
              />

              <Card className="mt-auto border-primary/10 bg-primary/5 shadow-sm">
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    {canExplore ? <Check className="size-4" aria-hidden /> : <Sparkles className="size-4" aria-hidden />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Explore unlocks after state and district scope are selected.</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {districtsStatus === "loading"
                        ? "Loading districts for your selected region."
                        : `${districtOptions.length} districts available, or explore the entire state.`}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <PrimaryButton disabled={!canExplore} onClick={handleExplore}>
                Explore
              </PrimaryButton>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </ScreenContainer>
    </main>
  );
}
