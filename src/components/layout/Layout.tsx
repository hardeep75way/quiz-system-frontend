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

const drawerWidth = 240;


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
            <Toolbar sx={{ justifyContent: 'center' }}>
                <Typography variant="h6" noWrap component="div" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
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
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: 'white', color: 'text.primary', borderBottom: 1, borderColor: 'divider', boxShadow: 'none' }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        Quiz System {isAdmin && <Typography component="span" variant="caption" sx={{ ml: 1, color: 'primary.main', fontWeight: 'bold', border: 1, px: 1, borderRadius: 1 }}>ADMIN</Typography>}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
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
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                {/* Mobile Drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                {/* Desktop Drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <BuggyButton />

            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh', bgcolor: 'background.default' }}
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
        <button onClick={() => setHasError(true)} style={{ position: 'fixed', bottom: 10, right: 10, zIndex: 9999 }}>
            Trigger Error
        </button>
    );
};