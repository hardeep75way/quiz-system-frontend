import { Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DraftsIcon from '@mui/icons-material/Drafts';
import PublishIcon from '@mui/icons-material/Publish';
import ArchiveIcon from '@mui/icons-material/Archive';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

type Status = 'draft' | 'published' | 'archived' | 'passed' | 'failed' | 'in-progress';

interface StatusBadgeProps {
    status: Status;
    size?: 'small' | 'medium';
}

const statusConfig = {
    draft: {
        label: 'Draft',
        color: 'default' as const,
        icon: <DraftsIcon fontSize="small" />,
    },
    published: {
        label: 'Published',
        color: 'success' as const,
        icon: <PublishIcon fontSize="small" />,
    },
    archived: {
        label: 'Archived',
        color: 'default' as const,
        icon: <ArchiveIcon fontSize="small" />,
    },
    passed: {
        label: 'Passed',
        color: 'success' as const,
        icon: <CheckCircleIcon fontSize="small" />,
    },
    failed: {
        label: 'Failed',
        color: 'error' as const,
        icon: <CancelIcon fontSize="small" />,
    },
    'in-progress': {
        label: 'In Progress',
        color: 'warning' as const,
        icon: <HourglassEmptyIcon fontSize="small" />,
    },
};

export default function StatusBadge({ status, size = 'small' }: StatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Chip
            label={config.label}
            color={config.color}
            size={size}
            icon={config.icon}
            sx={{
                fontWeight: 500,
                borderRadius: '6px',
            }}
        />
    );
}
