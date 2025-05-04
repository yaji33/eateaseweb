import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";



const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-6">
      <button
        className="flex w-full justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </span>
      </button>
      {isOpen && (
        <div className="mt-4">
          <p className="text-base text-gray-700">{answer}</p>
        </div>
      )}
    </div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      question: "How does EatEase differ from other food delivery platforms?",
      answer:
        "EatEase operates on a decentralized model where restaurants maintain direct relationships with their customers. Unlike traditional platforms that charge high commissions, we operate on minimal margins and prioritize restaurant control over their brand and customer experience.",
    },
    {
      question: "What fees do restaurants pay to use EatEase?",
      answer:
        "We charge only what's necessary to maintain operations - no heavy sales commissions or high onboarding fees. Our transparent fee structure means restaurants keep more of their hard-earned profits.",
    },
    {
      question: "How do customers order through the EatEase platform?",
      answer:
        "Customers use our restaurant-centered app that keeps your brand front and center. The ordering process is streamlined while maintaining the direct connection between you and your customers.",
    },
    {
      question: "Can I customize my restaurant's menu and offerings?",
      answer:
        "Absolutely! You have full control over your menu, pricing, special offers, and promotional activities. Our platform empowers you to showcase your unique brand identity.",
    },
    {
      question: "How do I get started with EatEase?",
      answer:
        "Simply click the 'Get Started for Free' button and follow our straightforward registration process. Our team will guide you through setting up your restaurant profile, and you'll be ready to accept orders in no time.",
    },
  ];

  return (
    <section className="bg-white font-poppins py-32">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-16">
          Frequently Asked Questions
        </h2>

        <div className="mt-12">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
