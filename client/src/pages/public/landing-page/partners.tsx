import React from "react";

const PartnersSection = ({ partners }) => {
  return (
    <section className="bg-gray-50 font-poppins py-32">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">
          Meet Our Partners
        </h2>

        <div className="flex flex-wrap justify-center items-center gap-12 mt-8">
          {partners && partners.length > 0 ? (
            partners.map((partner, index) => (
              <div key={index} className="w-32 h-32 relative">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            ))
          ) : (
            <div className="w-32 h-32 relative">
              <img
                src="/placeholder-logo.png"
                alt="Partner logo"
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
