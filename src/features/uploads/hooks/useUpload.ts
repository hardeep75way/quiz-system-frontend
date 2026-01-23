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

      const uploadId = uuidv4();


      const validation = await validateUploadFile(file);
      if (!validation.valid) {
        console.error('File validation failed:', validation.errors);

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

      const abortController = new AbortController();
      abortControllersRef.current.set(uploadId, abortController);

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

      dispatch(addUpload(initialUpload));

      try {
        const response = await uploadService.uploadFile(
          file,
          uploadId,
          (progress) => {
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
        const errorMessage = error?.message || 'Unknown error occurred';

        if (errorMessage !== 'Upload cancelled') {
          dispatch(
            failUpload({
              id: uploadId,
              error: errorMessage,
            })
          );
        }
      } finally {
        abortControllersRef.current.delete(uploadId);
      }
    },
    [dispatch]
  );

  const cancelUpload = useCallback(
    (uploadId: string) => {
      const abortController = abortControllersRef.current.get(uploadId);
      if (abortController) {
        abortController.abort();
        abortControllersRef.current.delete(uploadId);
      }

      uploadService.cancelUpload(uploadId);

      dispatch(cancelUploadAction(uploadId));
    },
    [dispatch]
  );
  //WIP
  const retryUpload = useCallback(
    async (uploadId: string) => {
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