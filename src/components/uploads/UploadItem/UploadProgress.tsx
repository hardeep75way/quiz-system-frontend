import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { formatFileSize } from '@/lib/uploadValidator';

interface UploadProgressProps {
    progress: number;
    uploadedBytes: number;
    totalBytes: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress, uploadedBytes, totalBytes }) => {
    return (
        <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {progress}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {formatFileSize(uploadedBytes)} / {formatFileSize(totalBytes)}
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={progress}
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
    );
};