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
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useUpload } from '@/features/uploads/hooks/useUpload';
import { useAppSelector } from '@/store/hooks';
import {
    selectUploadsArray,
    selectActiveUploadCount,
    selectCompletedUploads,
} from '@/features/uploads/hooks/useUploadSelector';
import { validateUploadFile } from '@/features/uploads/services/uploadValidator';

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

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Upload Files
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Upload and manage your files securely
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        elevation={2}
                        sx={{
                            borderLeft: 4,
                            borderColor: 'primary.main',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4,
                            }
                        }}
                    >
                        <CardContent>
                            <Typography variant="h3" color="primary" fontWeight={700}>
                                {uploads.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total Uploads
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        elevation={2}
                        sx={{
                            borderLeft: 4,
                            borderColor: 'warning.main',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4,
                            }
                        }}
                    >
                        <CardContent>
                            <Typography variant="h3" color="warning.main" fontWeight={700}>
                                {activeUploadCount}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Active Uploads
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        elevation={2}
                        sx={{
                            borderLeft: 4,
                            borderColor: 'success.main',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 4,
                            }
                        }}
                    >
                        <CardContent>
                            <Typography variant="h3" color="success.main" fontWeight={700}>
                                {completedUploads.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Completed
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Error Alert */}
            {validationError && (
                <Alert
                    severity="error"
                    onClose={() => setValidationError(null)}
                    sx={{ mb: 3 }}
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
                sx={{
                    p: 6,
                    textAlign: 'center',
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
                }}
                onClick={handleBrowseClick}
            >
                <CloudUploadIcon
                    sx={{
                        fontSize: 80,
                        color: isDragging ? 'primary.main' : 'grey.400',
                        mb: 2,
                        transition: 'color 0.3s ease',
                    }}
                />

                <Typography variant="h5" fontWeight={600} gutterBottom>
                    {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    or click to browse from your computer
                </Typography>

                <Button
                    variant="contained"
                    size="large"
                    startIcon={<FolderOpenIcon />}
                    onClick={handleBrowseClick}
                    sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                    }}
                >
                    Browse Files
                </Button>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.txt,.csv,.mp4,.avi,.mov,.webm,.ogg"
                />
            </Paper>

            {/* Supported Formats */}
            <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Supported File Types
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <DescriptionIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Documents"
                                    secondary="PDF, DOC, DOCX, TXT (100MB max)"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <ImageIcon color="success" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Images"
                                    secondary="JPG, PNG, GIF, WEBP (50MB max)"
                                />
                            </ListItem>
                        </List>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <InsertDriveFileIcon color="warning" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Videos"
                                    secondary="MP4, AVI, MOV, WebM, OGG (500MB max)"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <PictureAsPdfIcon color="error" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Spreadsheets"
                                    secondary="XLS, XLSX, CSV"
                                />
                            </ListItem>
                        </List>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <List dense>
                            <ListItem>
                                <ListItemIcon>
                                    <CloudUploadIcon color="info" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Upload Methods"
                                    secondary="Drag & drop or click to browse"
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>
                                    <FolderOpenIcon color="secondary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Multiple Files"
                                    secondary="Select or drag multiple files at once"
                                />
                            </ListItem>
                        </List>
                    </Grid>
                </Grid>

                <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight={500}>
                        💡 Tip: You can select or drag multiple files at once
                    </Typography>
                </Alert>
            </Paper>
        </Container>
    );
};