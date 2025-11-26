"use client";

import { useEffect, useState } from "react";
import { OnboardingTour } from "@/components/inbox/onboarding-tour";
import Home from "../page";

export default function OnboardingPage() {
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    // Aguardar um pouco para garantir que a página carregou completamente
    const timer = setTimeout(() => {
      setIsTourOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Home />
      <OnboardingTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </>
  );
}
