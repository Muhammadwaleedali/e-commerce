import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-20">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Admin Contact Information
      </h2>

      <div className="bg-white shadow-md rounded-2xl p-6 space-y-6 max-w-xl">
        <div>
          <p className="text-lg font-semibold text-gray-700">Email</p>
          <p className="text-gray-600">waleedali333421@gmail.com.com</p>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700">Phone</p>
          <p className="text-gray-600">+92 355-8039732</p>
        </div>

        <div>
          <p className="text-lg font-semibold text-gray-700">Address</p>
          <p className="text-gray-600">
            Village Danna, District Bhimber Tehsil Samahni Azad Jammu Kashmir
            <br />
            Office 301,
            <br />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
