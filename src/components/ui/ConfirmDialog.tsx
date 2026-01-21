import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

type Severity = 'warning' | 'error' | 'info';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    severity?: Severity;
}

const severityConfig = {
    warning: {
        icon: WarningAmberIcon,
        color: 'warning.main' as const,
    },
    error: {
        icon: ErrorOutlineIcon,
        color: 'error.main' as const,
    },
    info: {
        icon: InfoOutlinedIcon,
        color: 'info.main' as const,
    },
};

export default function ConfirmDialog({
    open,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    severity = 'info',
}: ConfirmDialogProps) {
    const config = severityConfig[severity];
    const Icon = config.icon;

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                },
            }}
        >
            <Box sx={{ textAlign: 'center', pt: 3 }}>
                <Icon sx={{ fontSize: 64, color: config.color, mb: 2 }} />
            </Box>

            <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                <Typography variant="h3">{title}</Typography>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" color="text.secondary" align="center">
                    {message}
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
                <Button
                    onClick={onCancel}
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    sx={{ maxWidth: { xs: '100%', sm: 120 } }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color={severity === 'error' ? 'error' : 'primary'}
                    fullWidth
                    sx={{ maxWidth: { xs: '100%', sm: 120 } }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
