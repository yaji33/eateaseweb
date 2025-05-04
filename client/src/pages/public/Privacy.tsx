//import React from "react";
import Logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white px-4 py-8 font-poppins text-sm sm:text-base">
      <div className="max-w-3xl mx-auto">
        {/* Logo */}
        <div
          className="flex items-center gap-2 mb-8 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={Logo} alt="logo" className="w-10 sm:w-12" />
          <h1 className="font-bold text-xl sm:text-2xl">
            <span className="text-brandPrimary">E</span>
            <span className="text-brandSecondary">atEase</span>
          </h1>
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold mb-4">
          Privacy Policy
        </h2>

        <p className="text-gray-500 mb-4">Last Updated: April 9, 2025</p>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <div>
            <p>
              At EatEase, we value your privacy. This policy explains how we
              collect, use, and protect your information.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Information We Collect</h3>
            <ul className="list-disc ml-6">
              <li>
                Personal Information: Name, email, phone number, and payment
                details.
              </li>
              <li>
                Usage Data: Interactions with the app, device information, and
                IP address.
              </li>
              <li>
                Location Data: If permitted, we collect your location to enhance
                services (e.g., finding nearby eateries).
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">How We Use Your Information</h3>
            <ul className="list-disc ml-6">
              <li>To process orders and payments.</li>
              <li>To improve user experience and customer support.</li>
              <li>To comply with legal obligations.</li>
              <li>
                For marketing and promotional purposes (only with your consent).
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Sharing Your Information</h3>
            <ul className="list-disc ml-6">
              <li>With eateries to process orders.</li>
              <li>With payment providers for secure transactions.</li>
              <li>With legal authorities if required by law.</li>
              <li>We do not sell or rent your personal information.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your
              data. However, no method of transmission is 100% secure.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Your Rights</h3>
            <ul className="list-disc ml-6">
              <li>
                You can request access, correction, or deletion of your data.
              </li>
              <li>You may opt out of marketing communications.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy periodically. Any changes will
              be posted in the app.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Contact Us</h3>
            <p>
              For privacy concerns, contact us at{" "}
              <span className="text-buttonPrimary">support@eatease.app</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
