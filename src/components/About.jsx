import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white px-6 py-12 md:px-20">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">About Us</h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-12">
          Welcome to <span className="font-semibold text-black">e-SHOP</span> — your go-to destination for the latest fashion, electronics, home essentials, and more.
          We’re committed to bringing you high-quality products at unbeatable prices, delivered right to your door.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {/* Mission */}
        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Mission</h2>
          <p className="text-gray-600">
            To make online shopping easy, affordable, and enjoyable for everyone, with fast delivery and excellent customer support.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Values</h2>
          <p className="text-gray-600">
            We believe in transparency, customer satisfaction, quality, and innovation. Your happiness is our priority.
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Goal</h2>
          <p className="text-gray-600">
            To become a trusted name in global eCommerce by offering great deals and seamless service every time you shop.
          </p>
        </div>
      </div>     
    </div>
  );
};

export default About;
