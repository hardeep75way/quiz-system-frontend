import React, { useState, useRef, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    Grid,
    Card,
    CardContent,
    Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useUpload } from '@/hooks/useUpload';
import { useAppSelector } from '@/store/hooks';
import {
    selectUploadsArray,
    selectActiveUploadCount,
    selectCompletedUploads,
} from '@/hooks/useUploadSelector';
import { validateUploadFile } from '@/lib/uploadValidator';



const styles = {
    hiddenInput: { display: 'none' },
    container: { py: 4 },
    header: { mb: 4 },
    statCard: (borderColor: string) => ({
        borderLeft: 4,
        borderColor: borderColor,
        transition: 'transform 0.2s',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 4,
        },
    }),
    alert: { mb: 3 },
    dropZone: (isDragging: boolean) => ({
        p: 6,
        textAlign: 'center' as const,
        border: 3,
        borderStyle: 'dashed',
        borderColor: isDragging ? 'primary.main' : 'grey.300',
        bgcolor: isDragging ? 'primary.50' : 'background.paper',
        borderRadius: 3,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        mb: 4,
        '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.50',
            transform: 'scale(1.01)',
        },
    }),
    uploadIcon: (isDragging: boolean) => ({
        fontSize: 80,
        color: isDragging ? 'primary.main' : 'grey.400',
        mb: 2,
        transition: 'color 0.3s ease',
    }),
    browseText: { mb: 3 },
    browseButton: {
        px: 4,
        py: 1.5,
        borderRadius: 2,
        textTransform: 'none' as const,
        fontSize: '1rem',
        fontWeight: 600,
    },
};

export const UploadPage: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const { startUpload } = useUpload();

    const uploads = useAppSelector(selectUploadsArray);
    const activeUploadCount = useAppSelector(selectActiveUploadCount);
    const completedUploads = useAppSelector(selectCompletedUploads);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
        async (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            setValidationError(null);

            const files = Array.from(e.dataTransfer.files);

            if (files.length === 0) return;

            // Validate and upload files
            for (const file of files) {
                const validation = await validateUploadFile(file);
                if (!validation.valid) {
                    setValidationError(validation.errors.join(', '));
                    continue;
                }
                startUpload(file);
            }
        },
        [startUpload]
    );

    const handleFileSelect = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            setValidationError(null);

            // Validate and upload files
            for (const file of Array.from(files)) {
                const validation = await validateUploadFile(file);
                if (!validation.valid) {
                    setValidationError(validation.errors.join(', '));
                    continue;
                }
                startUpload(file);
            }

            // Reset input
            e.target.value = '';
        },
        [startUpload]
    );

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const statCards = [
        {
            label: 'Total Uploads',
            value: uploads.length,
            color: 'primary.main',
            borderColor: 'primary.main',
        },
        {
            label: 'Active Uploads',
            value: activeUploadCount,
            color: 'warning.main',
            borderColor: 'warning.main',
        },
        {
            label: 'Completed',
            value: completedUploads.length,
            color: 'success.main',
            borderColor: 'success.main',
        },
    ];

    return (
        <Container maxWidth="lg" sx={styles.container}>
            {/* Header */}
            <Box sx={styles.header}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Upload Files
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Upload and manage your files securely
                </Typography>
            </Box>

            {/* Stats Cards */}

            {statCards.map((stat) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.label}>
                    <Card
                        elevation={2}
                        sx={styles.statCard(stat.borderColor)}
                    >
                        <CardContent>
                            <Typography variant="h3" color={stat.color} fontWeight={700}>
                                {stat.value}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {stat.label}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}

            {/* Error Alert */}
            {validationError && (
                <Alert
                    severity="error"
                    onClose={() => setValidationError(null)}
                    sx={styles.alert}
                >
                    {validationError}
                </Alert>
            )}

            {/* Drag & Drop Zone */}
            <Paper
                elevation={isDragging ? 8 : 2}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                sx={styles.dropZone(isDragging)}
                onClick={handleBrowseClick}
            >
                <CloudUploadIcon
                    sx={styles.uploadIcon(isDragging)}
                />

                <Typography variant="h5" fontWeight={600} gutterBottom>
                    {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={styles.browseText}>
                    or click to browse from your computer
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<FolderOpenIcon />}
                    onClick={handleBrowseClick}
                    sx={styles.browseButton}
                >
                    Browse Files
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={styles.hiddenInput}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt,.csv,.mp4,.avi,.mov,.webm,.ogg"
                />
            </Paper>


        </Container>
    );
};