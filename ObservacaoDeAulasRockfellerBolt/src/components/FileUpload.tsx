import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiFile, FiVideo, FiX, FiCheck } from 'react-icons/fi';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  acceptedFileTypes: string;
  label: string;
  description: string;
  icon: 'video' | 'file';
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileUpload,
  acceptedFileTypes,
  label,
  description,
  icon,
}) => {
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: { [acceptedFileTypes]: [] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileUpload(acceptedFiles[0]);
      }
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const IconComponent = icon === 'video' ? FiVideo : FiFile;

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative overflow-hidden group rounded-xl border-2 border-dashed transition-all duration-300
          ${isDragActive 
            ? 'border-rockfeller-blue-primary bg-rockfeller-blue-primary/5' 
            : 'border-gray-300 hover:border-rockfeller-blue-primary hover:bg-rockfeller-blue-primary/5'
          }`}
      >
        <input {...getInputProps()} />
        <div className="p-8">
          {acceptedFiles.length > 0 ? (
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{acceptedFiles[0].name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(acceptedFiles[0].size)}</p>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onFileUpload(acceptedFiles[0]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto w-12 h-12 mb-4 rounded-xl bg-rockfeller-blue-primary/10 flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-rockfeller-blue-primary" />
              </div>
              <p className="text-sm font-medium text-gray-900">{label}</p>
              <p className="mt-1 text-sm text-gray-500">{description}</p>
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-800">
                  {isDragActive ? 'Drop here' : 'Drag & drop or click'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};