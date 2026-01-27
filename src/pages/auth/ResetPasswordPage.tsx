import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';
import { authApi } from '@/api/auth';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validators';
import { AxiosError } from 'axios';
import { useEffect } from 'react';

const styles = {
    container: {
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    paper: {
        p: 4,
        width: '100%',
    },
    form: {
        mt: 1,
    },
    textField: {
        mt: 1,
    },
    button: {
        mt: 3,
        mb: 2,
    },
    link: {
        textDecoration: 'none',
    },
    linkTypography: {
        variant: 'body2',
        color: 'primary',
    },
}

export default function ResetPassword() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';

    useEffect(() => {
        if (!token) {
            enqueueSnackbar('Invalid or missing reset token', { variant: 'error' });
            navigate('/login');
        }
    }, [token, navigate, enqueueSnackbar]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(resetPasswordSchema) as unknown as import('react-hook-form').Resolver<ResetPasswordFormData>,
    });

    const resetPasswordMutation = useMutation({
        mutationFn: (data: { password: string }) => authApi.resetPassword(token, data.password),
        onSuccess: (data) => {
            enqueueSnackbar(data.message, { variant: 'success' });
            navigate('/login');
        },
        onError: (err: AxiosError<{ detail: string }>) => {
            enqueueSnackbar(err.response?.data?.detail || 'Failed to reset password', { variant: 'error' });
        },
    });

    const onSubmit = (data: ResetPasswordFormData) => {
        resetPasswordMutation.mutate({ password: data.password });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={styles.container}
            >
                <Paper elevation={3} sx={styles.paper}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Reset Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Enter your new password below.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={styles.form}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="New Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            autoFocus
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            {...register('password')}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={resetPasswordMutation.isPending}
                            sx={styles.button}
                        >
                            {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
                        </Button>

                        <Box sx={styles.linkTypography}>
                            <Link to="/login" style={styles.link}>
                                <Typography variant="body2" color="primary">
                                    Back to Login
                                </Typography>
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
