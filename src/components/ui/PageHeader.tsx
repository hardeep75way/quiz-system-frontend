import { Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { ReactNode } from 'react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: ReactNode;
}

export default function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
    return (
        <Box sx={{ mb: 4 }}>
            {breadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    sx={{ mb: 2 }}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return isLast || !crumb.href ? (
                            <Typography key={index} color="text.primary" variant="body2" fontWeight={600}>
                                {crumb.label}
                            </Typography>
                        ) : (
                            <MuiLink
                                key={index}
                                component={Link}
                                to={crumb.href}
                                color="text.secondary"
                                underline="hover"
                                variant="body2"
                            >
                                {crumb.label}
                            </MuiLink>
                        );
                    })}
                </Breadcrumbs>
            )}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 2,
                }}
            >
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h1" gutterBottom={!!description}>
                        {title}
                    </Typography>
                    {description && (
                        <Typography variant="body1" color="text.secondary">
                            {description}
                        </Typography>
                    )}
                </Box>

                {actions && (
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexShrink: 0,
                        }}
                    >
                        {actions}
                    </Box>
                )}
            </Box>
        </Box>
    );
}
