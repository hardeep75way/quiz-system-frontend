import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    CssBaseline,
    IconButton,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import UploadIcon from '@mui/icons-material/Upload';
import HistoryIcon from '@mui/icons-material/History';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';
import { UploadProgressPanel } from '@/components/uploads/UploadProgressPanel';
import React from 'react';

const styles = {
    root: { display: 'flex' },
    nav: { width: { sm: 240 }, flexShrink: { sm: 0 } },
    main: {
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${240}px)` },
        minHeight: '100vh',
        bgcolor: 'background.default',
    },

    appBar: {
        zIndex: (theme: any) => theme.zIndex.drawer + 1,
        bgcolor: 'white',
        color: 'text.primary',
        borderBottom: 1,
        borderColor: 'divider',
        boxShadow: 'none',
    },
    menuButton: { mr: 2, display: { sm: 'none' } },
    toolbarCenter: { justifyContent: 'center' },

    brandText: { color: 'primary.main', fontWeight: 'bold' },
    title: { flexGrow: 1, display: 'flex', alignItems: 'center' },
    adminBadge: {
        ml: 1,
        color: 'primary.main',
        fontWeight: 'bold',
        border: 1,
        px: 1,
        borderRadius: 1,
    },
    userSection: { display: 'flex', alignItems: 'center', gap: 2 },
    userInfo: { textAlign: 'right', display: { xs: 'none', sm: 'block' } },

    mobileDrawer: {
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
    },
    desktopDrawer: {
        display: { xs: 'none', sm: 'block' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
    },

    buggyButton: {
        position: 'fixed' as const,
        bottom: 10,
        left: 10,
        zIndex: 9999,
        color: 'red',
        border: '1px solid black',
        padding: '10px',
    },
};

export default function Layout() {
    const location = useLocation();
    const navigate = useNavigate();

    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const handleLogout = () => {
        dispatch(logout()); // Redux action
        navigate('/login');
    };

    const isAdmin = user?.role === 'admin';

    const navItems = isAdmin
        ? [
            { path: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon },
            { path: '/admin/quizzes', label: 'Quizzes', icon: QuizIcon },
            { path: '/admin/upload', label: 'Upload', icon: UploadIcon },
        ]
        : [
            { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
            { path: '/quizzes', label: 'My Quizzes', icon: QuizIcon },
            { path: '/results', label: 'Results', icon: HistoryIcon },
            { path: '/leaderboard', label: 'Leaderboard', icon: EmojiEventsIcon },
        ];

    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <div>
            <Toolbar sx={styles.toolbarCenter}>
                <Typography variant="h6" noWrap component="div" sx={styles.brandText}>
                    Q System
                </Typography>
            </Toolbar>
            <List>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <ListItem key={item.path} disablePadding>
                            <ListItemButton
                                component={Link}
                                to={item.path}
                                selected={location.pathname === item.path}
                                onClick={() => setMobileOpen(false)}
                            >
                                <ListItemIcon>
                                    <Icon color={location.pathname === item.path ? 'primary' : 'inherit'} />
                                </ListItemIcon>
                                <ListItemText primary={item.label} />
                            </ListItemButton>
                        </ListItem>
                    );
                })}

            </List>
        </div>
    );

    return (
        <Box sx={styles.root}>
            <CssBaseline />
            <AppBar position="fixed" sx={styles.appBar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={styles.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={styles.title}>
                        Quiz System {isAdmin && <Typography component="span" variant="caption" sx={styles.adminBadge}>ADMIN</Typography>}
                    </Typography>

                    <Box sx={styles.userSection}>
                        <Box sx={styles.userInfo}>
                            <Typography variant="subtitle2">{user?.username || 'User'}</Typography>
                            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                        </Box>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={styles.nav}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={styles.mobileDrawer}
                >
                    {drawer}
                </Drawer>
                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={styles.desktopDrawer}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <BuggyButton />

            <Box
                component="main"
                sx={styles.main}
            >
                <Toolbar />
                <Outlet />
            </Box>


            <UploadProgressPanel />
        </Box>
    );
}

const BuggyButton = () => {
    const [hasError, setHasError] = React.useState(false);

    if (hasError) {
        throw new Error('Test Crash!');
    }
    return (
        <button onClick={() => setHasError(true)} style={styles.buggyButton}>
            Trigger Error
        </button>
    );
};