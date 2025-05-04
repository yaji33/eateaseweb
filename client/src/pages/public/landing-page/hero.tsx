import React from "react";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  illustration: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ illustration }) => {
  const navigate = useNavigate();

  return (
    <section className="bg-background font-poppins py-40">
      <div className="flex flex-col md:flex-row items-center justify-center px-4">
        <div className="flex flex-col sm:flex-row gap-7 sm:justify-between w-full max-w-6xl mx-auto">
          <div className="flex flex-col justify-between">
            <div className="mt-12">
              <h1 className="text-4xl font-bold leading-tight text-gray-900">
                Decentralized Food Ordering. Maximum Flavor, Minimum Middlemen.
              </h1>
              <p className="mt-8 text-lg text-gray-700">
                Connect directly with your customers — no extra fees, no
                middlemen, and full control of your brand.
              </p>
            </div>
            <div className="mt-8">
              <button
                className="inline-block px-8 py-4 text-white bg-red-600 rounded hover:bg-red-700 text-lg"
                onClick={() => navigate("/registration")}
              >
                Get Started for Free
              </button>
            </div>
          </div>
          <div className="md:mt-0 flex-grow flex justify-center md:justify-end">
            <img
              src={illustration}
              alt="Food ordering illustration"
              className="w-full md:w-auto lg:max-w-lg h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
