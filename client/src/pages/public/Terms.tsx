//import React from "react";
import Logo from "@/assets/logo.png";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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

        <h2 className="text-xl sm:text-2xl font-semibold mb-4">Terms of Use</h2>

        <section className="space-y-4 text-gray-700 leading-relaxed">
          <div>
            <h3 className="font-semibold">Acceptance of Terms</h3>
            <p>
              By accessing or using our mobile application EatEase, you agree to
              comply with these Terms. If you do not agree, please do not use
              the app.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Use of the Service</h3>
            <ul className="list-disc ml-6">
              <li>
                You must be at least 18 years old or have parental consent to
                use the app.
              </li>
              <li>
                You agree to provide accurate and up-to-date information when
                creating an account.
              </li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Ordering and Payments</h3>
            <ul className="list-disc ml-6">
              <li>
                Orders placed through the app are binding once confirmed by the
                eatery.
              </li>
              <li>
                Prices and availability of items are determined by the
                respective eateries.
              </li>
              <li>
                Payments must be made through the app using available payment
                methods.
              </li>
              <li>No refunds will be issued unless approved by the eatery.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Cancellations and Refunds</h3>
            <ul className="list-disc ml-6">
              <li>Cancellation policies are set by individual eateries.</li>
              <li>
                Refunds are processed at the discretion of the eatery and may
                take several business days.
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">User Conduct</h3>
            <ul className="list-disc ml-6">
              <li>
                You agree not to misuse the platform, including fraudulent
                activities, abusive behavior, or spamming.
              </li>
              <li>Any violation may result in termination of your account.</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Limitation of Liability</h3>
            <p>
              EatEase acts as a facilitator between users and eateries. We are
              not responsible for the quality of food or service. We are not
              liable for any losses arising from the use of the app.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Changes to Terms</h3>
            <p>
              We reserve the right to update these Terms at any time. Continued
              use of the app after changes constitutes acceptance.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Contact Us</h3>
            <p>
              If you have any questions, contact us at{" "}
              <span className="text-buttonPrimary">support@eatease.app</span>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms;
