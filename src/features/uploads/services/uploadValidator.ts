import * as yup from 'yup';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
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
  'text/plain',
  'text/csv',
];

export const uploadFileSchema = yup.object({
  file: yup
    .mixed()
    .required('File is required')
    .test('fileSize', 'File size must be less than 100MB', (value) => {
      if (!value) return false;
      return (value as File).size <= MAX_FILE_SIZE;
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
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('word')) return '📝';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
  if (mimeType.includes('text')) return '📃';
  return '📁';
};