import React from 'react';
import { Box, Typography } from '@mui/material';

interface UploadErrorProps {
    error: string;
}

export const UploadError: React.FC<UploadErrorProps> = ({ error }) => {
    return (
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
                ⚠️ {error}
            </Typography>
        </Box>
    );
};
