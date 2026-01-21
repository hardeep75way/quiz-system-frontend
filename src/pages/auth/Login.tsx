import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { getErrorMessage } from '@/api/client';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Link,
    Alert
} from '@mui/material';
import { useSnackbar } from 'notistack';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: async (data) => {
            // First step: get tokens
            const { access_token, refresh_token } = data;

            // Note: In a real app we might not have the user object yet.
            // But setCredentials expects a user.
            // We'll dispatch tokens first if our slice allows, OR fetch user then dispatch all.
            // Let's fetch user immediately.

            try {
                // Manually set token in localStorage for the immediate next request
                // (Depends on how your apiClient interceptor reads it. It reads from localStorage 'auth-storage' or similar?)
                // The current api/client.ts reads from 'auth-storage' local storage key which is ZUSTAND persists.
                // WE NEED TO UPDATE apiClient TO READ FROM REDUX STORING PLACE or standard localStorage keys.
                // For this refactor, let's assume valid tokens allow requests.

                // Temporary hack to make sure apiClient picks up the token for the very next request
                // Redux implementation in authSlice sets 'accessToken' item in localStorage.
                // So we should do:
                localStorage.setItem('accessToken', access_token);

                const user = await authApi.getCurrentUser();

                dispatch(setCredentials({
                    user,
                    accessToken: access_token,
                    refreshToken: refresh_token
                }));

                enqueueSnackbar('Login successful!', { variant: 'success' });
                navigate(user.role === 'admin' ? '/admin/dashboard' : '/dashboard');
            } catch (error) {
                console.error('Failed to fetch user:', error);
                enqueueSnackbar('Failed to fetch user details', { variant: 'error' });
            }
        },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate(data);
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
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                        Sign in to your account
                    </Typography>

                    {loginMutation.isError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {getErrorMessage(loginMutation.error)}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            autoComplete="email"
                            autoFocus
                            error={!!errors.email}
                            helperText={errors.email?.message as string}
                            {...register('email')}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            error={!!errors.password}
                            helperText={errors.password?.message as string}
                            {...register('password')}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loginMutation.isPending}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                        </Button>
                        <Box sx={{ textAlign: 'center' }}>
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"Don't have an account? Sign up"}
                            </Link>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
