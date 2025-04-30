import React from "react";
import Navbar from "@/components/public/navbar";
import HeroSection from "./Hero";
import FeaturesSection from "./features";
import PartnersSection from "./partners";
import Footer from "../Footer";
import Illustration from "@/assets/landing-page-img.png";
import partnerLogo from "@/assets/macgab.jpg";

export default function LandingPage() {
  const partners = [
    {
      name: "Restaurant Partner",
      logo: partnerLogo,
    },
  ];

  return (
    <>
      <Navbar />
      <main>
        <HeroSection illustration={Illustration} />
        <FeaturesSection />
        <PartnersSection partners={partners} />
      </main>
      <Footer />
    </>
  );
}
