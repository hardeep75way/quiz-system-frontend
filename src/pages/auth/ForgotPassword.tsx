import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';
import { authApi } from '@/api/auth';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validators';
import { AxiosError } from 'axios';

export default function ForgotPassword() {
    const { enqueueSnackbar } = useSnackbar();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: yupResolver(forgotPasswordSchema) as unknown as import('react-hook-form').Resolver<ForgotPasswordFormData>,
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: (email: string) => authApi.forgotPassword(email),
        onSuccess: (data) => {
            enqueueSnackbar(data.message, { variant: 'success' });

            // In development, show the reset token
            if (data.reset_token) {
                enqueueSnackbar(`Reset Token: ${data.reset_token}`, {
                    variant: 'info',
                    persist: true,
                });
            }
        },
        onError: (err: AxiosError<{ detail: string }>) => {
            enqueueSnackbar(err.response?.data?.detail || 'Failed to send reset email', { variant: 'error' });
        },
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        forgotPasswordMutation.mutate(data.email);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
                    <Typography component="h1" variant="h5" align="center" gutterBottom>
                        Forgot Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            {...register('email')}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={forgotPasswordMutation.isPending}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {forgotPasswordMutation.isPending ? 'Sending...' : 'Send Reset Link'}
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Link to="/login" style={{ textDecoration: 'none' }}>
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
