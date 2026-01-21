import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Paper } from '@mui/material';
import { useSnackbar } from 'notistack';
import { authApi } from '@/api/auth'

    ;
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/validators';
import { AxiosError } from 'axios';

export default function ChangePassword() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ChangePasswordFormData>({
        resolver: yupResolver(changePasswordSchema) as unknown as import('react-hook-form').Resolver<ChangePasswordFormData>,
    });

    const changePasswordMutation = useMutation({
        mutationFn: (data: { currentPassword: string; newPassword: string }) =>
            authApi.changePassword(data.currentPassword, data.newPassword),
        onSuccess: (data) => {
            enqueueSnackbar(data.message, { variant: 'success' });
            reset();
            // Optionally navigate to dashboard or logout
            setTimeout(() => navigate('/dashboard'), 1500);
        },
        onError: (err: AxiosError<{ detail: string }>) => {
            enqueueSnackbar(err.response?.data?.detail || 'Failed to change password', { variant: 'error' });
        },
    });

    const onSubmit = (data: ChangePasswordFormData) => {
        changePasswordMutation.mutate({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
        });
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
                        Change Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Enter your current password and choose a new one.
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Current Password"
                            type="password"
                            id="currentPassword"
                            autoComplete="current-password"
                            autoFocus
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword?.message}
                            {...register('currentPassword')}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="New Password"
                            type="password"
                            id="newPassword"
                            autoComplete="new-password"
                            error={!!errors.newPassword}
                            helperText={errors.newPassword?.message}
                            {...register('newPassword')}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm New Password"
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
                            disabled={changePasswordMutation.isPending}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {changePasswordMutation.isPending ? 'Changing...' : 'Change Password'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
