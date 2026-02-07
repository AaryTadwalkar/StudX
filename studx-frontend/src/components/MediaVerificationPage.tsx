import React, { useState } from 'react';
import { useAuth, getAuthHeaders } from '../context/AuthContext';
import type { AppState } from '../types';
import { Upload, X, Image as ImageIcon, Video, FileText, CheckCircle, Loader } from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  description: string;
}

interface MediaVerificationPageProps {
  skillName: string;
  skillId?: string;
  onComplete: (result: { badge: string; mediaCount: number }) => void;
  onCancel: () => void;
  onNavigate: (s: AppState) => void;
}

const MediaVerificationPage: React.FC<MediaVerificationPageProps> = ({
  skillName,
  skillId,
  onComplete,
  onCancel,
  onNavigate
}) => {
  const { user } = useAuth();
  
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      // Validate file type
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      if (!isImage && !isVideo) {
        alert('Please upload only images or videos');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const newFile: MediaFile = {
          id: Date.now().toString() + Math.random(),
          file,
          preview: event.target?.result as string,
          type: isImage ? 'image' : 'video',
          description: ''
        };
        
        setMediaFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleRemoveFile = (id: string) => {
    setMediaFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleDescriptionChange = (id: string, description: string) => {
    setMediaFiles(prev => prev.map(f => 
      f.id === id ? { ...f, description } : f
    ));
  };

  const handleSubmit = async () => {
    if (mediaFiles.length === 0) {
      alert('Please upload at least one photo or video');
      return;
    }

    // Check if all files have descriptions
    const missingDescriptions = mediaFiles.some(f => !f.description.trim());
    if (missingDescriptions) {
      alert('Please add a description for each file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Upload each file
      for (let i = 0; i < mediaFiles.length; i++) {
        const mediaFile = mediaFiles[i];
        
        // Convert file to base64 for backend
        const base64 = mediaFile.preview;

        const response = await fetch(`${API_BASE}/skills/media-proof`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            skillId,
            mediaType: mediaFile.type,
            description: mediaFile.description,
            image: base64 // Backend expects 'image' field for Cloudinary upload
          })
        });

        if (!response.ok) {
          throw new Error('Failed to upload media');
        }

        // Update progress
        setUploadProgress(((i + 1) / mediaFiles.length) * 100);
      }

      // Success!
      setTimeout(() => {
        onComplete({
          badge: 'Verified',
          mediaCount: mediaFiles.length
        });
      }, 500);

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload media. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-8 flex items-center justify-between border border-white/20">
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Media Verification</h1>
            <p className="text-white/70 font-medium">
              Upload photos or videos to verify your {skillName} skill
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl">
          
          {/* Drag & Drop Zone */}
          <label className="block mb-8">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <div className="border-4 border-dashed border-slate-200 rounded-3xl p-16 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-all">
                <Upload className="text-blue-600" size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Drop files here or click to browse
              </h3>
              <p className="text-slate-500 font-medium mb-4">
                Upload screenshots, project photos, certificates, or demo videos
              </p>
              <p className="text-sm text-slate-400">
                Supports: JPG, PNG, GIF, MP4, MOV (max 10MB per file)
              </p>
            </div>
          </label>

          {/* Examples */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
              <FileText size={18} className="text-blue-600" />
              What to Upload:
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 font-medium">
              <li>• <strong>For Coding Skills:</strong> GitHub profile, LeetCode streak, project screenshots, deployed websites</li>
              <li>• <strong>For Design Skills:</strong> Portfolio pieces, Figma/Canva designs, client work</li>
              <li>• <strong>For Physical Skills:</strong> Performance videos, competition photos, certificates</li>
              <li>• <strong>For Academic Skills:</strong> Grades, certificates, tutoring session screenshots</li>
            </ul>
          </div>

          {/* Uploaded Files */}
          {mediaFiles.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-black text-slate-900 mb-4">
                Uploaded Files ({mediaFiles.length})
              </h3>
              {mediaFiles.map((media) => (
                <div key={media.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <div className="flex gap-6">
                    {/* Preview */}
                    <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-200 flex-shrink-0 shadow-inner">
                      {media.type === 'image' ? (
                        <img 
                          src={media.preview} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-300">
                          <Video className="text-slate-600" size={40} />
                        </div>
                      )}
                    </div>

                    {/* Description Input */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {media.type === 'image' ? (
                            <ImageIcon size={18} className="text-blue-600" />
                          ) : (
                            <Video size={18} className="text-purple-600" />
                          )}
                          <span className="text-sm font-black text-slate-700 uppercase tracking-wider">
                            {media.type}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(media.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                          disabled={uploading}
                        >
                          <X size={18} />
                        </button>
                      </div>
                      
                      <textarea
                        value={media.description}
                        onChange={(e) => handleDescriptionChange(media.id, e.target.value)}
                        placeholder="Describe what this shows (e.g., 'LeetCode 100-day streak', 'React e-commerce project')"
                        className="w-full bg-white border-2 border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                        rows={3}
                        disabled={uploading}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-black text-slate-700 uppercase tracking-wider">
                  Uploading... {Math.round(uploadProgress)}%
                </span>
                <Loader className="animate-spin text-blue-600" size={20} />
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              disabled={uploading}
              className="px-8 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={mediaFiles.length === 0 || uploading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Submit Verification ({mediaFiles.length} file{mediaFiles.length !== 1 ? 's' : ''})
                </>
              )}
            </button>
          </div>

          {/* Info */}
          <p className="text-center text-sm text-slate-400 mt-8">
            Your uploads will be securely stored and visible in your skill profile
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default MediaVerificationPage;
