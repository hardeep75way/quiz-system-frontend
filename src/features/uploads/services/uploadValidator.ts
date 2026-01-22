import * as yup from 'yup';

const MAX_FILE_SIZE_DOCUMENTS = 100 * 1024 * 1024; // 100MB for documents
const MAX_FILE_SIZE_IMAGES = 50 * 1024 * 1024;      // 50MB for images
const MAX_FILE_SIZE_VIDEOS = 500 * 1024 * 1024;     // 500MB for videos

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/avi',
  'video/quicktime',  // .mov files
  'video/x-msvideo',  // .avi files
  'video/webm',
  'video/ogg',
  'text/plain',
  'text/csv',
];

export const uploadFileSchema = yup.object({
  file: yup
    .mixed()
    .required('File is required')
    .test('fileSize', 'File size exceeds allowed limit', (value) => {
      if (!value) return false;
      const file = value as File;
      const mimeType = file.type;

      // Determine max size based on file type
      let maxSize: number;
      if (mimeType.startsWith('video/')) {
        maxSize = MAX_FILE_SIZE_VIDEOS;
      } else if (mimeType.startsWith('image/')) {
        maxSize = MAX_FILE_SIZE_IMAGES;
      } else {
        maxSize = MAX_FILE_SIZE_DOCUMENTS;
      }

      return file.size <= maxSize;
    })
    .test('fileType', 'File type is not supported', (value) => {
      if (!value) return false;
      return ALLOWED_FILE_TYPES.includes((value as File).type);
    }),
});

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export const validateUploadFile = async (file: File): Promise<ValidationResult> => {
  try {
    await uploadFileSchema.validate({ file });
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { valid: false, errors: error.errors };
    }
    return { valid: false, errors: ['Unknown validation error'] };
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const getFileIcon = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return '🖼️';
  if (mimeType.startsWith('video/')) return '🎥';
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.includes('text')) return '📃';
  return '📁';
};