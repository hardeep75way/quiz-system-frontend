import { Skeleton, Card, CardContent, Box, Grid } from '@mui/material';

interface LoadingCardProps {
    variant?: 'stats' | 'quiz' | 'table-row';
    count?: number;
}

export default function LoadingCard({ variant = 'quiz', count = 1 }: LoadingCardProps) {
    const renderSkeleton = () => {
        switch (variant) {
            case 'stats':
                return (
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Skeleton variant="circular" width={64} height={64} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="60%" height={24} />
                                    <Skeleton variant="text" width="40%" height={20} />
                                </Box>
                            </Box>
                            <Skeleton variant="text" width="80%" height={48} />
                        </CardContent>
                    </Card>
                );

            case 'quiz':
                return (
                    <Card>
                        <Skeleton variant="rectangular" height={160} />
                        <CardContent>
                            <Skeleton variant="text" width="70%" height={32} sx={{ mb: 1 }} />
                            <Skeleton variant="text" width="100%" height={20} />
                            <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 2 }} />
                                <Skeleton variant="rectangular" width={80} height={32} sx={{ borderRadius: 2 }} />
                            </Box>
                        </CardContent>
                    </Card>
                );

            case 'table-row':
                return (
                    <Box sx={{ display: 'flex', gap: 2, py: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Skeleton variant="text" width="30%" />
                        <Skeleton variant="text" width="15%" />
                        <Skeleton variant="text" width="20%" />
                        <Skeleton variant="text" width="20%" />
                        <Skeleton variant="rectangular" width={40} height={32} />
                    </Box>
                );

            default:
                return <Skeleton variant="rectangular" height={200} />;
        }
    };

    if (variant === 'stats') {
        return (
            <Grid container spacing={3}>
                {Array.from({ length: count }).map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                        {renderSkeleton()}
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (variant === 'quiz') {
        return (
            <Grid container spacing={3}>
                {Array.from({ length: count }).map((_, index) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                        {renderSkeleton()}
                    </Grid>
                ))}
            </Grid>
        );
    }

    return (
        <Box>
            {Array.from({ length: count }).map((_, index) => (
                <Box key={index}>{renderSkeleton()}</Box>
            ))}
        </Box>
    );
}
