//import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div className="p-12 bg-white rounded-lg shadow-sm">
    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    <p className="mt-4 text-gray-700">{description}</p>
  </div>
);

const FeaturesSection = () => {
  const features = [
    {
      title: "Real-No-Middleman Model",
      description:
        "No heavy sales commission or onboarding fees. Direct connection with customers and full control of your brand.",
    },
    {
      title: "Zero Profits, Low-Margins",
      description:
        "Unlike others, our platform isn't designed to extract profits from restaurants. We charge only what's needed to maintain operations.",
    },
    {
      title: "Restaurant-Centered Customer App",
      description:
        "Your brand stays front and center with an app designed to maintain your direct connection with customers.",
    },
  ];

  return (
    <section className="bg-gray-50 font-poppins py-32">
      <div className="max-w-6xl mx-auto flex flex-col space-y-24">
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-center text-gray-900">
            Why Restaurants Choose Us
          </h2>
          <p className="text-center text-lg text-gray-700 mt-4">
            More control, better margins. Stronger customer relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
