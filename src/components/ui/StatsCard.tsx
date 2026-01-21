import { Card, CardContent, Box, Typography, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { ReactNode } from 'react';
import { colors } from '@/theme/tokens';
import LoadingCard from './LoadingCard';

interface Trend {
    value: number;
    isPositive: boolean;
}

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: Trend;
    color?: 'primary' | 'secondary' | 'success' | 'warning';
    loading?: boolean;
    onClick?: () => void;
}

const colorConfig = {
    primary: {
        background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
        light: colors.primary[50],
    },
    secondary: {
        background: `linear-gradient(135deg, ${colors.secondary[500]} 0%, ${colors.secondary[600]} 100%)`,
        light: colors.secondary[50],
    },
    success: {
        background: `linear-gradient(135deg, ${colors.success.main} 0%, ${colors.success.dark} 100%)`,
        light: '#d1fae5',
    },
    warning: {
        background: `linear-gradient(135deg, ${colors.warning.main} 0%, ${colors.warning.dark} 100%)`,
        light: '#fef3c7',
    },
};

export default function StatsCard({
    title,
    value,
    icon,
    trend,
    color = 'primary',
    loading = false,
    onClick,
}: StatsCardProps) {
    if (loading) {
        return <LoadingCard variant="stats" count={1} />;
    }

    const config = colorConfig[color];

    return (
        <Card
            sx={{
                height: '100%',
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': onClick
                    ? {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)',
                    }
                    : {},
            }}
            onClick={onClick}
        >
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                    {/* Icon Circle */}
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: config.background,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                            flexShrink: 0,
                        }}
                    >
                        {icon}
                    </Box>

                    {/* Trend Indicator */}
                    {trend && (
                        <Chip
                            icon={trend.isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
                            label={`${trend.isPositive ? '+' : ''}${trend.value}%`}
                            size="small"
                            color={trend.isPositive ? 'success' : 'error'}
                            sx={{ ml: 'auto' }}
                        />
                    )}
                </Box>

                {/* Title */}
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: 0.5,
                        mb: 1,
                    }}
                >
                    {title}
                </Typography>

                {/* Value */}
                <Typography
                    variant="h2"
                    sx={{
                        fontWeight: 700,
                        fontSize: '2.5rem',
                        lineHeight: 1,
                        background: config.background,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}
