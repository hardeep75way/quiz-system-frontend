import { Box, Typography, Button } from '@mui/material';
import { ReactNode } from 'react';
import InboxIcon from '@mui/icons-material/Inbox';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ComingSoonIcon from '@mui/icons-material/Schedule';

type EmptyStateVariant = 'no-data' | 'no-results' | 'error' | 'coming-soon';

interface EmptyStateProps {
    variant: EmptyStateVariant;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    illustration?: ReactNode;
}

const variantConfig = {
    'no-data': {
        icon: InboxIcon,
        color: 'text.secondary' as const,
    },
    'no-results': {
        icon: SearchOffIcon,
        color: 'text.secondary' as const,
    },
    error: {
        icon: ErrorOutlineIcon,
        color: 'error.main' as const,
    },
    'coming-soon': {
        icon: ComingSoonIcon,
        color: 'primary.main' as const,
    },
};

export default function EmptyState({
    variant,
    title,
    description,
    action,
    illustration,
}: EmptyStateProps) {
    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                px: 3,
                textAlign: 'center',
                maxWidth: 400,
                mx: 'auto',
            }}
        >
            {illustration || (
                <Icon
                    sx={{
                        fontSize: 120,
                        color: config.color,
                        opacity: 0.5,
                        mb: 3,
                    }}
                />
            )}

            <Typography variant="h3" gutterBottom>
                {title}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {description}
            </Typography>

            {action && (
                <Button variant="contained" size="large" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </Box>
    );
}
