import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Link,
    Paper,
    InputAdornment,
    IconButton,
    Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { authApi } from '@/api/auth';
import { loginSchema, type LoginFormData } from '@/lib/validators';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/slices/authSlice';
import { AxiosError } from 'axios';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: yupResolver(loginSchema) as unknown as import('react-hook-form').Resolver<LoginFormData>,
    });

    const loginMutation = useMutation({
        mutationFn: (data: LoginFormData) => authApi.login(data.email, data.password),
        onSuccess: async (tokenData) => {
            // Save tokens to localStorage FIRST so API client can use them
            localStorage.setItem('accessToken', tokenData.access_token);
            localStorage.setItem('refreshToken', tokenData.refresh_token);

            // Now fetch user data with the token in place
            const userResponse = await authApi.getCurrentUser();

            // Update Redux state
            dispatch(setCredentials({
                user: userResponse,
                accessToken: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
            }));

            enqueueSnackbar('Welcome back!', { variant: 'success' });
            navigate('/dashboard');
        },
        onError: (err: AxiosError<{ detail: string }>) => {
            enqueueSnackbar(err.response?.data?.detail || 'Login failed', { variant: 'error' });
        },
    });

    const onSubmit: SubmitHandler<LoginFormData> = (data) => {
        loginMutation.mutate(data);
    };

    return (
        <Grid container sx={{ minHeight: '100vh' }}>
            {/* Left Panel - Brand */}
            <Grid item xs={false} md={5}>
                <AuthBrandPanel />
            </Grid>

            {/* Right Panel - Form */}
            <Grid item xs={12} md={7}>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    sx={{
                        minHeight: '100vh',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: { xs: 2, sm: 4 },
                        backgroundColor: 'background.default',
                    }}
                >
                    <Paper
                        elevation={0}
                        sx={{
                            maxWidth: 460,
                            width: '100%',
                            p: { xs: 3, sm: 5 },
                            borderRadius: 3,
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            border: 1,
                            borderColor: 'grey.200',
                        }}
                    >
                        {/* Header */}
                        <Box sx={{ mb: 4, textAlign: 'center' }}>
                            <Typography variant="h2" gutterBottom>
                                Welcome Back
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Sign in to your account to continue
                            </Typography>
                        </Box>

                        {/* Form */}
                        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                autoComplete="email"
                                autoFocus
                                error={!!errors.email}
                                helperText={errors.email?.message}
                                {...register('email')}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                {...register('password')}
                                sx={{ mb: 1 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                size="small"
                                                aria-label="toggle password visibility"
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box sx={{ textAlign: 'right', mb: 3 }}>
                                <Link
                                    component={RouterLink}
                                    to="/forgot-password"
                                    variant="body2"
                                    underline="hover"
                                >
                                    Forgot password?
                                </Link>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loginMutation.isPending}
                                sx={{ mb: 3, minHeight: 48 }}
                            >
                                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?{' '}
                                    <Link component={RouterLink} to="/register" underline="hover" fontWeight={600}>
                                        Sign up
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Grid>
        </Grid>
    );
}
