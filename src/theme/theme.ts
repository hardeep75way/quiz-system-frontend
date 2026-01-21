import { createTheme } from '@mui/material/styles';
import { colors, shadows } from './tokens';

export const theme = createTheme({
    palette: {
        primary: {
            main: colors.primary[500],
            light: colors.primary[400],
            dark: colors.primary[600],
            contrastText: '#ffffff',
        },
        secondary: {
            main: colors.secondary[500],
            light: colors.secondary[400],
            dark: colors.secondary[600],
            contrastText: '#ffffff',
        },
        error: {
            main: colors.error.main,
            light: colors.error.light,
            dark: colors.error.dark,
        },
        warning: {
            main: colors.warning.main,
            light: colors.warning.light,
            dark: colors.warning.dark,
        },
        success: {
            main: colors.success.main,
            light: colors.success.light,
            dark: colors.success.dark,
        },
        info: {
            main: colors.info.main,
            light: colors.info.light,
            dark: colors.info.dark,
        },
        grey: colors.neutral,
        background: {
            default: colors.neutral[50],
            paper: colors.neutral[0],
        },
        text: {
            primary: colors.neutral[900],
            secondary: colors.neutral[600],
            disabled: colors.neutral[400],
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
        h1: {
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 700,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '0.875rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
            fontWeight: 400,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
            fontWeight: 400,
        },
        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.4,
            fontWeight: 500,
        },
        button: {
            fontSize: '0.9375rem',
            fontWeight: 600,
            textTransform: 'none',
            letterSpacing: '0.01em',
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
        },
    },
    shape: {
        borderRadius: 8,
    },
    shadows: [
        'none',
        shadows.xs,
        shadows.sm,
        shadows.md,
        shadows.lg,
        shadows.xl,
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
        shadows['2xl'],
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '0.9375rem',
                    boxShadow: 'none',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        transform: 'translateY(-1px)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                },
                contained: {
                    '&:hover': {
                        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
                    },
                },
                containedPrimary: {
                    background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.primary[600]} 100%)`,
                    '&:hover': {
                        background: `linear-gradient(135deg, ${colors.primary[600]} 0%, ${colors.primary[700]} 100%)`,
                    },
                },
                sizeLarge: {
                    padding: '12px 28px',
                    fontSize: '1rem',
                    minHeight: '48px',
                },
                sizeSmall: {
                    padding: '6px 16px',
                    fontSize: '0.875rem',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        transition: 'all 0.2s',
                        backgroundColor: colors.neutral[50],
                        '&:hover': {
                            backgroundColor: colors.neutral[100],
                        },
                        '&.Mui-focused': {
                            backgroundColor: colors.neutral[0],
                            boxShadow: `0 0 0 3px ${colors.primary[500]}1A`, // 10% opacity
                        },
                        '& fieldset': {
                            borderColor: colors.neutral[300],
                        },
                        '&:hover fieldset': {
                            borderColor: colors.neutral[400],
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: colors.primary[500],
                            borderWidth: 2,
                        },
                    },
                    '& .MuiInputLabel-root': {
                        fontWeight: 500,
                        color: colors.neutral[600],
                        '&.Mui-focused': {
                            color: colors.primary[600],
                        },
                    },
                },
            },
            defaultProps: {
                variant: 'outlined',
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: '16px',
                    boxShadow: shadows.sm,
                    border: `1px solid ${colors.neutral[200]}`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: shadows.lg,
                        transform: 'translateY(-2px)',
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: '12px',
                },
                elevation1: {
                    boxShadow: shadows.sm,
                },
                elevation2: {
                    boxShadow: shadows.md,
                },
                elevation3: {
                    boxShadow: shadows.lg,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    borderRadius: '6px',
                },
                filled: {
                    backgroundColor: colors.neutral[200],
                    color: colors.neutral[700],
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: colors.neutral[200],
                },
                head: {
                    fontWeight: 600,
                    backgroundColor: colors.neutral[50],
                    color: colors.neutral[700],
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: colors.neutral[200],
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: shadows.sm,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: `1px solid ${colors.neutral[200]}`,
                },
            },
        },
    },
});