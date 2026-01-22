import React from 'react';
import { Box, Typography, IconButton, LinearProgress, Chip } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useAppDispatch } from '@/store/hooks';
import { removeUpload } from '@/store/slices/uploadSlice';
import { useUpload } from '../hooks/useUpload';
import { SerializableUploadFile, UploadStatus } from '@/types/upload';
import { formatFileSize, getFileIcon } from '../services/uploadValidator';

interface UploadItemProps {
  upload: SerializableUploadFile;
}

export const UploadItem: React.FC<UploadItemProps> = ({ upload }) => {
  const dispatch = useAppDispatch();
  const { cancelUpload } = useUpload();

  const handleCancel = () => {
    cancelUpload(upload.id);
  };

  const handleRemove = () => {
    dispatch(removeUpload(upload.id));
  };

  const getStatusChip = () => {
    switch (upload.status) {
      case UploadStatus.UPLOADING:
        return <Chip label="Uploading" size="small" color="primary" />;
      case UploadStatus.COMPLETED:
        return <Chip icon={<CheckCircleIcon />} label="Completed" size="small" color="success" />;
      case UploadStatus.FAILED:
        return <Chip icon={<ErrorIcon />} label="Failed" size="small" color="error" />;
      case UploadStatus.CANCELLED:
        return <Chip label="Cancelled" size="small" color="warning" />;
      default:
        return <Chip label="Pending" size="small" />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
        bgcolor: 'background.paper',
      }}
    >
      {/* File Icon */}
      <Box sx={{ fontSize: '1.5rem' }}>
        {getFileIcon(upload.mimeType)}
      </Box>

      {/* File Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'medium',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={upload.filename}
        >
          {upload.filename}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {formatFileSize(upload.fileSize)}
          </Typography>
          {getStatusChip()}
        </Box>

        {/* Progress Bar */}
        {upload.status === UploadStatus.UPLOADING && (
          <Box sx={{ mt: 1 }}>
            <LinearProgress
              variant="determinate"
              value={upload.progress}
              sx={{ height: 4, borderRadius: 2 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {upload.progress}% • {formatFileSize(upload.uploadedBytes)} / {formatFileSize(upload.totalBytes)}
            </Typography>
          </Box>
        )}

        {/* Error Message */}
        {upload.status === UploadStatus.FAILED && upload.error && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
            {upload.error}
          </Typography>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {upload.status === UploadStatus.UPLOADING && (
          <IconButton
            size="small"
            onClick={handleCancel}
            color="error"
            title="Cancel upload"
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        )}

        {(upload.status === UploadStatus.COMPLETED ||
          upload.status === UploadStatus.FAILED ||
          upload.status === UploadStatus.CANCELLED) && (
          <IconButton
            size="small"
            onClick={handleRemove}
            color="default"
            title="Remove from list"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};