export enum UploadStatus {
  PENDING = 'pending',
  UPLOADING = 'uploading',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

export interface UploadFile {
  id: string;                    // Client-generated UUID
  file: File;                    // Native File object (NOTE: not serializable in Redux)
  filename: string;
  fileSize: number;
  mimeType: string;
  status: UploadStatus;
  progress: number;              // 0-100
  uploadedBytes: number;
  totalBytes: number;
  error?: string;
  uploadedAt?: string;
  url?: string;
  serverId?: string;             // Server-assigned ID after completion
  abortController?: AbortController; // For cancellation (not serializable)
}

// Redux-serializable version (for storing in Redux)
export interface SerializableUploadFile {
  id: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  status: UploadStatus;
  progress: number;
  uploadedBytes: number;
  totalBytes: number;
  error?: string;
  uploadedAt?: string;
  url?: string;
  serverId?: string;
}

export interface UploadState {
  uploads: Record<string, SerializableUploadFile>; // Use Record instead of Map for Redux
  activeUploadIds: string[];                        // Track order
  isMinimized: boolean;                             // Panel UI state
}