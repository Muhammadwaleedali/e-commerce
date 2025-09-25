import React from "react";

const Modal = ({ isModelOpen, setIsModelOpen, children }) => {
  if (!isModelOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 opacity-91 flex items-center justify-center z-50 ">
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full   max-w-md mx-4 mr-24">
        <button
          className="absolute top-0 right-0
           text-gray-500 
           text-4xl hover:text-gray-700"
          onClick={() => setIsModelOpen(false)}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
