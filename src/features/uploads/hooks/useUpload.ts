import { useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch } from '@/store/hooks';
import {
  addUpload,
  updateUploadProgress,
  completeUpload,
  failUpload,
  cancelUpload as cancelUploadAction,
} from '@/store/slices/uploadSlice';
import { uploadService } from '../services/uploadService';
import { validateUploadFile } from '../services/uploadValidator';
import { UploadStatus, SerializableUploadFile } from '@/types/upload';

export const useUpload = () => {
  const dispatch = useAppDispatch();
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map());

  const startUpload = useCallback(
    async (file: File) => {
      // Generate unique ID for this upload
      const uploadId = uuidv4();

      // Validate file before upload
      const validation = await validateUploadFile(file);
      if (!validation.valid) {
        console.error('File validation failed:', validation.errors);

        // Add failed upload to store
        const failedUpload: SerializableUploadFile = {
          id: uploadId,
          filename: file.name,
          fileSize: file.size,
          mimeType: file.type,
          status: UploadStatus.FAILED,
          progress: 0,
          uploadedBytes: 0,
          totalBytes: file.size,
          error: validation.errors.join(', '),
        };

        dispatch(addUpload(failedUpload));
        return;
      }

      // Create abort controller for this upload
      const abortController = new AbortController();
      abortControllersRef.current.set(uploadId, abortController);

      // Create initial upload state
      const initialUpload: SerializableUploadFile = {
        id: uploadId,
        filename: file.name,
        fileSize: file.size,
        mimeType: file.type,
        status: UploadStatus.PENDING,
        progress: 0,
        uploadedBytes: 0,
        totalBytes: file.size,
      };

      // Add to Redux store
      dispatch(addUpload(initialUpload));

      try {
        // Start upload
        const response = await uploadService.uploadFile(
          file,
          uploadId,
          (progress) => {
            // Dispatch progress updates to Redux
            dispatch(
              updateUploadProgress({
                id: uploadId,
                progress: progress.progress,
                uploadedBytes: progress.uploadedBytes,
              })
            );
          },
          abortController.signal
        );

        // Handle successful upload
        if (response.success && response.data) {
          dispatch(
            completeUpload({
              id: uploadId,
              serverId: response.data.file_id,
              url: response.data.url,
              uploadedAt: response.data.uploaded_at,
            })
          );
        } else {
          throw new Error(response.error?.message || 'Upload failed');
        }
      } catch (error: any) {
        // Handle upload failure
        const errorMessage = error?.message || 'Unknown error occurred';

        // Don't mark as failed if it was cancelled
        if (errorMessage !== 'Upload cancelled') {
          dispatch(
            failUpload({
              id: uploadId,
              error: errorMessage,
            })
          );
        }
      } finally {
        // Clean up abort controller
        abortControllersRef.current.delete(uploadId);
      }
    },
    [dispatch]
  );

  const cancelUpload = useCallback(
    (uploadId: string) => {
      // Abort the upload
      const abortController = abortControllersRef.current.get(uploadId);
      if (abortController) {
        abortController.abort();
        abortControllersRef.current.delete(uploadId);
      }

      // Also cancel via upload service (backup)
      uploadService.cancelUpload(uploadId);

      // Update Redux state
      dispatch(cancelUploadAction(uploadId));
    },
    [dispatch]
  );

  const retryUpload = useCallback(
    async (uploadId: string) => {
      // Note: We can't retry with the original File object from Redux
      // This would need to be handled by re-selecting the file
      // For now, this is a placeholder that would need implementation
      console.warn('Retry upload not implemented - file object not available in Redux state');
    },
    []
  );

  return {
    startUpload,
    cancelUpload,
    retryUpload,
  };
};