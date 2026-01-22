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
    LinearProgress,
    Grid,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { authApi } from '@/api/auth';
import { registerSchema, type RegisterFormData } from '@/lib/validators';
import { AxiosError } from 'axios';
import AuthBrandPanel from '@/components/auth/AuthBrandPanel';

export default function RegisterPage() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterFormData>({
        resolver: yupResolver(registerSchema) as unknown as import('react-hook-form').Resolver<RegisterFormData>,
    });

    const password = watch('password', '');

    // Password strength calculation
    const getPasswordStrength = (pwd: string): number => {
        if (!pwd) return 0;
        let strength = 0;
        if (pwd.length >= 8) strength += 25;
        if (/[A-Z]/.test(pwd)) strength += 25;
        if (/[a-z]/.test(pwd)) strength += 25;
        if (/[0-9]/.test(pwd)) strength += 25;
        return strength;
    };

    const passwordStrength = getPasswordStrength(password);

    const registerMutation = useMutation({
        mutationFn: (data: RegisterFormData) => authApi.register(data.email, data.username, data.password),
        onSuccess: async () => {
            enqueueSnackbar('Account created successfully!', { variant: 'success' });
            navigate('/dashboard');
        },
        onError: (err: AxiosError<{ detail: string }>) => {
            enqueueSnackbar(err.response?.data?.detail || 'Registration failed', { variant: 'error' });
        },
    });

    const onSubmit: SubmitHandler<RegisterFormData> = (data) => {
        registerMutation.mutate(data);
    };

    const getStrengthColor = () => {
        if (passwordStrength < 50) return 'error';
        if (passwordStrength < 75) return 'warning';
        return 'success';
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
                                Create Account
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Join our platform and start learning
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
                                label="Username"
                                type="text"
                                autoComplete="username"
                                error={!!errors.username}
                                helperText={errors.username?.message}
                                {...register('username')}
                                sx={{ mb: 2 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="new-password"
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

                            {/* Password Strength Indicator */}
                            {password && (
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                        Password strength
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={passwordStrength}
                                        color={getStrengthColor()}
                                        sx={{
                                            height: 6,
                                            borderRadius: 3,
                                            backgroundColor: 'grey.200',
                                        }}
                                    />
                                </Box>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={registerMutation.isPending}
                                sx={{ mb: 3, minHeight: 48 }}
                            >
                                {registerMutation.isPending ? 'Creating account...' : 'Sign Up'}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>
                                        Sign in
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
