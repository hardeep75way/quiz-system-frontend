import React from 'react';
import { Paper, Typography, IconButton, Box, Button } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  selectUploadsArray,
  selectHasActiveUploads,
  selectIsMinimized,
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
      elevation={4}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        width: 400,
        maxHeight: '60vh',
        overflow: 'hidden',
        zIndex: 1300,
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          cursor: 'pointer',
        }}
        onClick={handleToggleMinimize}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" component="div">
            📤 {hasActiveUploads ? 'Uploading...' : 'Uploads'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ({uploads.length})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!isMinimized && (
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleClearCompleted();
              }}
              sx={{ minWidth: 'auto', px: 1 }}
            >
              Clear completed
            </Button>
          )}

          <IconButton size="small" onClick={(e) => {
            e.stopPropagation();
            handleToggleMinimize();
          }}>
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
            p: 1,
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