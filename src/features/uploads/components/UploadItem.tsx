import React from 'react';
import { Box, Typography, IconButton, LinearProgress, Chip, Paper } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
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
        return (
          <Chip
            label="Uploading"
            size="small"
            color="primary"
            sx={{ fontWeight: 600 }}
          />
        );
      case UploadStatus.COMPLETED:
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Completed"
            size="small"
            color="success"
            sx={{ fontWeight: 600 }}
          />
        );
      case UploadStatus.FAILED:
        return (
          <Chip
            icon={<ErrorIcon />}
            label="Failed"
            size="small"
            color="error"
            sx={{ fontWeight: 600 }}
          />
        );
      case UploadStatus.CANCELLED:
        return (
          <Chip
            label="Cancelled"
            size="small"
            color="warning"
            sx={{ fontWeight: 600 }}
          />
        );
      default:
        return (
          <Chip
            icon={<AccessTimeIcon />}
            label="Pending"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
    }
  };

  const getBorderColor = () => {
    switch (upload.status) {
      case UploadStatus.UPLOADING:
        return 'primary.main';
      case UploadStatus.COMPLETED:
        return 'success.main';
      case UploadStatus.FAILED:
        return 'error.main';
      case UploadStatus.CANCELLED:
        return 'warning.main';
      default:
        return 'divider';
    }
  };

  const getBackgroundColor = () => {
    switch (upload.status) {
      case UploadStatus.UPLOADING:
        return 'primary.50';
      case UploadStatus.COMPLETED:
        return 'success.50';
      case UploadStatus.FAILED:
        return 'error.50';
      case UploadStatus.CANCELLED:
        return 'warning.50';
      default:
        return 'background.paper';
    }
  };

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
        borderColor: getBorderColor(),
        bgcolor: getBackgroundColor(),
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
          {getStatusChip()}
        </Box>

        {/* Progress Bar */}
        {upload.status === UploadStatus.UPLOADING && (
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                {upload.progress}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(upload.uploadedBytes)} / {formatFileSize(upload.totalBytes)}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={upload.progress}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                }
              }}
            />
          </Box>
        )}

        {/* Error Message */}
        {upload.status === UploadStatus.FAILED && upload.error && (
          <Box
            sx={{
              mt: 1,
              p: 1,
              bgcolor: 'error.100',
              borderRadius: 1,
              border: 1,
              borderColor: 'error.200',
            }}
          >
            <Typography variant="caption" color="error.dark" fontWeight={500}>
              ⚠️ {upload.error}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {upload.status === UploadStatus.UPLOADING && (
          <IconButton
            size="small"
            onClick={handleCancel}
            color="error"
            title="Cancel upload"
            sx={{
              bgcolor: 'error.100',
              '&:hover': {
                bgcolor: 'error.200',
              }
            }}
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
              title="Remove from list"
              sx={{
                bgcolor: 'grey.200',
                '&:hover': {
                  bgcolor: 'grey.300',
                }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
      </Box>
    </Paper>
  );
};