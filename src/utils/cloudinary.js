// Cloudinary configuration
export const CLOUDINARY_CLOUD_NAME = 'dp8bfdbab';
export const CLOUDINARY_UPLOAD_PRESET = 'cryptchat';
export const CLOUDINARY_API_KEY = '337739287121541';

/**
 * Upload an image file to Cloudinary (unsigned upload).
 * @param {File} file - The image file to upload.
 * @param {string} folder - Optional folder name in Cloudinary (e.g. 'tuhe-swami/properties').
 * @returns {Promise<string>} The secure URL of the uploaded image.
 */
export const uploadToCloudinary = async (file, folder = 'tuhe-swami-properties') => {
  if (!file) throw new Error('No file provided');

  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Cloudinary upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Upload multiple image files to Cloudinary in sequence.
 * @param {FileList|File[]} files - Array of image files.
 * @param {string} folder - Optional folder name.
 * @returns {Promise<string[]>} Array of secure URLs.
 */
export const uploadMultipleToCloudinary = async (files, folder = 'tuhe-swami-properties') => {
  const urls = [];
  for (const file of files) {
    const url = await uploadToCloudinary(file, folder);
    urls.push(url);
  }
  return urls;
};

/**
 * Build a transformed Cloudinary URL for optimized delivery.
 * @param {string} url - Original Cloudinary URL.
 * @param {object} options - Transformation options ({ width, height }).
 * @returns {string} Transformed URL.
 */
export const cloudinaryTransform = (url, options = {}) => {
  if (!url || !url.includes('res.cloudinary.com')) return url;
  const { width = 900, height = 650 } = options;
  return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},h_${height},c_fill/`);
};
