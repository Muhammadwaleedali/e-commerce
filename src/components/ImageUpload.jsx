import React, { useState } from "react";

const ImageUpload = ({ onImageSelect, currentImage }) => {
  const [preview, setPreview] = useState(currentImage);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
      const maxSize = 5 * 1024 * 1024;

      if (!validTypes.includes(file.type)) {
        throw new Error(
          "Invalid file type. Only JPEG, PNG, and WebP images are allowed."
        );
      }

      if (file.size > maxSize) {
        throw new Error("File size too large. Maximum size is 5MB.");
      }

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);

      onImageSelect(file);
    } catch (err) {
      setError(err.message);
      console.error("Image upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="min-h-[200px] flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
        {preview ? (
          <div className="relative w-full h-full">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto object-contain"
            />
          </div>
        ) : (
          <label className="cursor-pointer block text-center p-6">
            <div className="text-gray-500">
              <div className="text-4xl mb-2">+</div>
              <div>Click to upload image</div>
              <div className="text-sm">(Max size: 5MB)</div>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>
        )}
      </div>
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default ImageUpload;
