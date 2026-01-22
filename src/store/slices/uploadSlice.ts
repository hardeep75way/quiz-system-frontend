import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UploadState, SerializableUploadFile, UploadStatus } from '@/types/upload';

const initialState: UploadState = {
  uploads: {},
  activeUploadIds: [],
  isMinimized: false,
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    // Add a new upload to the queue
    addUpload: (state, action: PayloadAction<SerializableUploadFile>) => {
      const upload = action.payload;
      state.uploads[upload.id] = upload;
      state.activeUploadIds.push(upload.id);
      state.isMinimized = false; // Auto-expand panel on new upload
    },

    // Update upload progress
    updateUploadProgress: (
      state,
      action: PayloadAction<{
        id: string;
        progress: number;
        uploadedBytes: number;
      }>
    ) => {
      const { id, progress, uploadedBytes } = action.payload;
      if (state.uploads[id]) {
        state.uploads[id].progress = progress;
        state.uploads[id].uploadedBytes = uploadedBytes;
        state.uploads[id].status = UploadStatus.UPLOADING;
      }
    },

    // Mark upload as completed
    completeUpload: (
      state,
      action: PayloadAction<{
        id: string;
        serverId: string;
        url: string;
        uploadedAt: string;
      }>
    ) => {
      const { id, serverId, url, uploadedAt } = action.payload;
      if (state.uploads[id]) {
        state.uploads[id].status = UploadStatus.COMPLETED;
        state.uploads[id].progress = 100;
        state.uploads[id].serverId = serverId;
        state.uploads[id].url = url;
        state.uploads[id].uploadedAt = uploadedAt;
      }
    },

    // Mark upload as failed
    failUpload: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const { id, error } = action.payload;
      if (state.uploads[id]) {
        state.uploads[id].status = UploadStatus.FAILED;
        state.uploads[id].error = error;
      }
    },

    // Cancel an upload
    cancelUpload: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.uploads[id]) {
        state.uploads[id].status = UploadStatus.CANCELLED;
      }
    },

    // Remove a specific upload
    removeUpload: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.uploads[id];
      state.activeUploadIds = state.activeUploadIds.filter((uploadId) => uploadId !== id);
    },

    // Clear all completed uploads
    clearCompletedUploads: (state) => {
      const completedIds = Object.keys(state.uploads).filter(
        (id) => state.uploads[id].status === UploadStatus.COMPLETED
      );
      completedIds.forEach((id) => {
        delete state.uploads[id];
      });
      state.activeUploadIds = state.activeUploadIds.filter((id) => !completedIds.includes(id));
    },

    // Clear all uploads
    clearAllUploads: (state) => {
      state.uploads = {};
      state.activeUploadIds = [];
    },

    // Toggle panel minimized state
    togglePanelMinimized: (state) => {
      state.isMinimized = !state.isMinimized;
    },

    // Set panel minimized state
    setPanelMinimized: (state, action: PayloadAction<boolean>) => {
      state.isMinimized = action.payload;
    },
  },
});

export const {
  addUpload,
  updateUploadProgress,
  completeUpload,
  failUpload,
  cancelUpload,
  removeUpload,
  clearCompletedUploads,
  clearAllUploads,
  togglePanelMinimized,
  setPanelMinimized,
} = uploadSlice.actions;

export default uploadSlice.reducer;