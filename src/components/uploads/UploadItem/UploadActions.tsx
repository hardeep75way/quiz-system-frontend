import React from 'react';
import { Box, IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { UploadStatus } from '@/types/upload';

interface UploadActionsProps {
    status: UploadStatus;
    onCancel: () => void;
    onRemove: () => void;
}

export const UploadActions: React.FC<UploadActionsProps> = ({ status, onCancel, onRemove }) => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {status === UploadStatus.UPLOADING && (
                <IconButton
                    size="small"
                    onClick={onCancel}
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

            {(status === UploadStatus.COMPLETED ||
                status === UploadStatus.FAILED ||
                status === UploadStatus.CANCELLED) && (
                    <IconButton
                        size="small"
                        onClick={onRemove}
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
    );
};
