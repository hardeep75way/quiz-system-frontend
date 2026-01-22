import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import { UploadStatus } from '@/types/upload';

// Base selector
export const selectUploadState = (state: RootState) => state.upload;

// Memoized selectors using createSelector for performance
export const selectAllUploads = createSelector(
  [selectUploadState],
  (uploadState) => uploadState.uploads
);

export const selectActiveUploadIds = createSelector(
  [selectUploadState],
  (uploadState) => uploadState.activeUploadIds
);

export const selectIsMinimized = createSelector(
  [selectUploadState],
  (uploadState) => uploadState.isMinimized
);

// Get uploads as array (ordered by activeUploadIds)
export const selectUploadsArray = createSelector(
  [selectAllUploads, selectActiveUploadIds],
  (uploads, activeIds) => activeIds.map((id) => uploads[id]).filter(Boolean)
);

// Get only active uploads (uploading or pending)
export const selectActiveUploads = createSelector(
  [selectUploadsArray],
  (uploads) =>
    uploads.filter(
      (upload) =>
        upload.status === UploadStatus.UPLOADING || upload.status === UploadStatus.PENDING
    )
);

// Get completed uploads
export const selectCompletedUploads = createSelector(
  [selectUploadsArray],
  (uploads) => uploads.filter((upload) => upload.status === UploadStatus.COMPLETED)
);

// Get failed uploads
export const selectFailedUploads = createSelector(
  [selectUploadsArray],
  (uploads) => uploads.filter((upload) => upload.status === UploadStatus.FAILED)
);

// Count of active uploads
export const selectActiveUploadCount = createSelector(
  [selectActiveUploads],
  (activeUploads) => activeUploads.length
);

// Check if any upload is in progress
export const selectHasActiveUploads = createSelector(
  [selectActiveUploadCount],
  (count) => count > 0
);

// Get specific upload by ID
export const selectUploadById = (id: string) =>
  createSelector([selectAllUploads], (uploads) => uploads[id]);