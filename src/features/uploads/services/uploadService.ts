import { v4 as uuidv4 } from 'uuid';
import { uploadFileSchema } from './uploadValidator';

export interface UploadProgress {
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
}

export interface UploadResponse {
  success: boolean;
  data?: {
    file_id: string;
    filename: string;
    file_size: number;
    mime_type: string;
    url: string;
    uploaded_at: string;
  };
  error?: {
    code: string;
    message: string;
    details?: object;
  };
}

export class UploadService {
  private apiBaseUrl: string;
  private activeUploads: Map<string, XMLHttpRequest>;

  constructor(apiBaseUrl: string) {
    this.apiBaseUrl = apiBaseUrl;
    this.activeUploads = new Map();
  }

  /**
   * Upload a file to the server with progress tracking
   */
  async uploadFile(
    file: File,
    uploadId: string,
    onProgress: (progress: UploadProgress) => void,
    abortSignal?: AbortSignal
  ): Promise<UploadResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      this.activeUploads.set(uploadId, xhr);

      // Handle abort signal
      if (abortSignal) {
        abortSignal.addEventListener('abort', () => {
          xhr.abort();
          this.activeUploads.delete(uploadId);
          reject(new Error('Upload cancelled'));
        });
      }

      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress({
            progress,
            uploadedBytes: event.loaded,
            totalBytes: event.total,
          });
        }
      });

      // Handle successful upload
      xhr.addEventListener('load', () => {
        this.activeUploads.delete(uploadId);

        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response: UploadResponse = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Invalid server response'));
          }
        } else {
          try {
            const errorResponse: UploadResponse = JSON.parse(xhr.responseText);
            reject(errorResponse.error || new Error(`Upload failed with status ${xhr.status}`));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        this.activeUploads.delete(uploadId);
        reject(new Error('Network error occurred during upload'));
      });

      xhr.addEventListener('abort', () => {
        this.activeUploads.delete(uploadId);
        reject(new Error('Upload was cancelled'));
      });

      xhr.addEventListener('timeout', () => {
        this.activeUploads.delete(uploadId);
        reject(new Error('Upload timeout'));
      });

      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);

      // Get auth token (adjust based on your auth implementation)
      const token = localStorage.getItem('accessToken'); // or from Redux state

      // Configure and send request
      xhr.open('POST', `${this.apiBaseUrl}/uploads`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.timeout = 300000; // 5 minutes timeout
      xhr.send(formData);
    });
  }

  /**
   * Cancel an active upload
   */
  cancelUpload(uploadId: string): void {
    const xhr = this.activeUploads.get(uploadId);
    if (xhr) {
      xhr.abort();
      this.activeUploads.delete(uploadId);
    }
  }

  /**
   * Cancel all active uploads
   */
  cancelAllUploads(): void {
    this.activeUploads.forEach((xhr) => xhr.abort());
    this.activeUploads.clear();
  }
}

// Singleton instance
export const uploadService = new UploadService(import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1');