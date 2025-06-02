import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FiEdit2, FiCamera, FiUser, FiX, FiSave } from "react-icons/fi";
import AnimatedButton from "@/components/AnimatedButton";
import { ensureHttps } from "@/utils/cloudinaryConfig";

interface ProfileSectionProps {
  student: any;
  isEditing: boolean;
  canEdit: boolean;
  onEditToggle: () => void;
  onPhotoSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isUploading: boolean;
  editedData: any;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSaveChanges: () => void; // Added missing prop
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  student,
  isEditing,
  canEdit,
  onEditToggle,
  onPhotoSelect,
  fileInputRef,
  isUploading,
  editedData,
  handleChange,
  onSaveChanges, // Added missing prop
}) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    console.error("Failed to load image");
  };

  return (
    <>
      {/* Header/Cover Image */}
      <div className="h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
        {!isEditing && canEdit && (
          <button
            onClick={onEditToggle}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <FiEdit2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Profile Content */}
      <div className="px-6 pb-8 md:px-10 -mt-20 relative">
        {/* Profile Picture */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="relative mx-auto md:mx-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl border-4 border-white overflow-hidden shadow-lg bg-white">
              {isEditing ? (
                <div
                  className="w-full h-full cursor-pointer group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {editedData.photoURL ? (
                    <>
                      <img
                        src={ensureHttps(editedData.photoURL)}
                        alt={editedData.fullName}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                      {imageError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <FiUser className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiCamera className="w-8 h-8 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                      <FiCamera className="w-10 h-10 text-gray-400 mb-2" />
                      <span className="text-xs text-gray-500">
                        Upload Photo
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onPhotoSelect}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              ) : (
                <>
                  {student.photoURL ? (
                    <img
                      src={student.photoURL}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                      <FiUser className="w-16 h-16" />
                    </div>
                  )}
                </>
              )}
            </div>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Basic Information */}
          <div className="flex-1 text-center md:text-left mt-4 md:mt-16">
            {isEditing ? (
              <div className="space-y-4">
                <input
                  type="text"
                  name="fullName"
                  value={editedData.fullName}
                  onChange={handleChange}
                  className="text-2xl font-bold text-gray-900 w-full border-b-2 border-gray-200 focus:border-primary px-2 py-1 outline-none"
                  placeholder="Your Name"
                />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-900">
                  {student.fullName}
                </h1>
              </>
            )}

            {/* Edit/Save Buttons - Mobile */}
            <div className="flex justify-center md:hidden mt-4 space-x-2">
              {isEditing && (
                <>
                  <AnimatedButton
                    onClick={onEditToggle}
                    variant="outline"
                    size="sm"
                    icon={<FiX />}
                  >
                    Cancel
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={onSaveChanges}
                    variant="primary"
                    size="sm"
                    icon={<FiSave />}
                  >
                    Save Changes
                  </AnimatedButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
