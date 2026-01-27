import React from 'react';
import { Box, Typography, Chip, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useAppDispatch } from '@/store/hooks';
import { removeUpload } from '@/store/slices/uploadSlice';
import { useUpload } from '@/hooks/useUpload';
import { SerializableUploadFile, UploadStatus } from '@/types/upload';
import { formatFileSize, getFileIcon } from '@/lib/uploadValidator';
import { UploadProgress } from './UploadProgress';
import { UploadError } from './UploadError';
import { UploadActions } from './UploadActions';

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

  const statusConfig = {
    [UploadStatus.PENDING]: {
      chipLabel: 'Pending',
      chipColor: 'default' as const,
      chipIcon: <AccessTimeIcon />,
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    },
    [UploadStatus.UPLOADING]: {
      chipLabel: 'Uploading',
      chipColor: 'primary' as const,
      chipIcon: undefined,
      borderColor: 'primary.main',
      backgroundColor: 'primary.50',
    },
    [UploadStatus.COMPLETED]: {
      chipLabel: 'Completed',
      chipColor: 'success' as const,
      chipIcon: <CheckCircleIcon />,
      borderColor: 'success.main',
      backgroundColor: 'success.50',
    },
    [UploadStatus.FAILED]: {
      chipLabel: 'Failed',
      chipColor: 'error' as const,
      chipIcon: <ErrorIcon />,
      borderColor: 'error.main',
      backgroundColor: 'error.50',
    },
    [UploadStatus.CANCELLED]: {
      chipLabel: 'Cancelled',
      chipColor: 'warning' as const,
      chipIcon: undefined,
      borderColor: 'warning.main',
      backgroundColor: 'warning.50',
    },
  } as const;

  const currentConfig = statusConfig[upload.status];

  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 2,
        mb: 1.5,
        borderRadius: 2,
        border: 2,
        borderColor: currentConfig.borderColor,
        bgcolor: currentConfig.backgroundColor,
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        '&:last-child': {
          mb: 0,
        },
      }}
    >
      {/* File Icon */}
      <Box
        sx={{
          fontSize: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 1,
        }}
      >
        {getFileIcon(upload.mimeType)}
      </Box>

      {/* File Info */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 0.5,
          }}
          title={upload.filename}
        >
          {upload.filename}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={500}>
            {formatFileSize(upload.fileSize)}
          </Typography>
          <Chip
            icon={currentConfig.chipIcon}
            label={currentConfig.chipLabel}
            size="small"
            color={currentConfig.chipColor}
            sx={{ fontWeight: 600 }}
          />
        </Box>

        {/* Progress Bar */}
        {upload.status === UploadStatus.UPLOADING && (
          <UploadProgress
            progress={upload.progress}
            uploadedBytes={upload.uploadedBytes}
            totalBytes={upload.totalBytes}
          />
        )}

        {/* Error Message */}
        {upload.status === UploadStatus.FAILED && upload.error && (
          <UploadError error={upload.error} />
        )}
      </Box>

      {/* Actions */}
      <UploadActions
        status={upload.status}
        onCancel={handleCancel}
        onRemove={handleRemove}
      />
    </Paper>
  );
};