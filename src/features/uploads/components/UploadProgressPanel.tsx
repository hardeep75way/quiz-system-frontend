import React from 'react';
import { Paper, Typography, IconButton, Box, Button, Badge } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  selectUploadsArray,
  selectHasActiveUploads,
  selectIsMinimized,
  selectActiveUploadCount,
} from '../hooks/useUploadSelector';
import {
  togglePanelMinimized,
  clearCompletedUploads,
} from '@/store/slices/uploadSlice';
import { UploadItem } from './UploadItem';

export const UploadProgressPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const uploads = useAppSelector(selectUploadsArray);
  const hasActiveUploads = useAppSelector(selectHasActiveUploads);
  const isMinimized = useAppSelector(selectIsMinimized);
  const activeUploadCount = useAppSelector(selectActiveUploadCount);

  // Don't render if no uploads
  if (uploads.length === 0) {
    return null;
  }

  const handleToggleMinimize = () => {
    dispatch(togglePanelMinimized());
  };

  const handleClearCompleted = () => {
    dispatch(clearCompletedUploads());
  };

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        width: 420,
        maxHeight: '65vh',
        overflow: 'hidden',
        zIndex: 1300,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.default',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2.5,
          py: 2,
          borderBottom: 1,
          borderColor: 'divider',
          cursor: 'pointer',
          bgcolor: hasActiveUploads ? 'primary.main' : 'grey.800',
          color: 'white',
          transition: 'background-color 0.3s ease',
          '&:hover': {
            bgcolor: hasActiveUploads ? 'primary.dark' : 'grey.900',
          },
        }}
        onClick={handleToggleMinimize}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Badge
            badgeContent={activeUploadCount}
            color="error"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: 'error.main',
                color: 'white',
                fontWeight: 'bold',
              }
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 24 }} />
          </Badge>
          <Box>
            <Typography variant="subtitle1" component="div" fontWeight={600}>
              {hasActiveUploads ? 'Uploading Files' : 'Uploads'}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {uploads.length} {uploads.length === 1 ? 'file' : 'files'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMinimized && (
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleClearCompleted();
              }}
              sx={{
                minWidth: 'auto',
                px: 1.5,
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
              variant="outlined"
            >
              Clear
            </Button>
          )}

          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMinimize();
            }}
            sx={{ color: 'white' }}
          >
            {isMinimized ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Upload Items */}
      {!isMinimized && (
        <Box
          sx={{
            maxHeight: '50vh',
            overflowY: 'auto',
            p: 2,
            bgcolor: 'grey.50',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'grey.400',
              borderRadius: '4px',
              '&:hover': {
                bgcolor: 'grey.500',
              },
            },
          }}
        >
          {uploads.map((upload) => (
            <UploadItem key={upload.id} upload={upload} />
          ))}
        </Box>
      )}
    </Paper>
  );
};