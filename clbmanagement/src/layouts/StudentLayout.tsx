import React, { useEffect, useState } from 'react';
import { Box, Container, IconButton, Typography, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Home, Event, Group, Notifications, Settings, ExitToApp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfile } from '../services/authService';

interface StudentLayoutProps {
    children: React.ReactNode;
}

export const StudentLayout = ({ children }: StudentLayoutProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    const fetchProfile = async () => {
        setLoading(true);
        const response = await getProfile();
        setProfile(response);
        setLoading(false);
    };

    const menuItems = [
        { icon: <Home />, text: 'Trang chủ', path: '/' },
        // { icon: <Event />, text: 'Sự kiện', path: '/events' },
        { icon: <Group />, text: 'CLB của tôi', path: '/my-clubs' },
        // { icon: <Notifications />, text: 'Thông báo', path: '/notifications' },
        { icon: <Settings />, text: 'Cài đặt', path: '/settings' },
    ];

    const handleLogout = () => {
        // Add logout logic here
        navigate('/login');
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <Box sx={{
            display: 'flex',
            minHeight: '100vh',
            background: 'linear-gradient(120deg, #f0f7ff 0%, #e6f0ff 100%)',
        }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: 280,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 280,
                        boxSizing: 'border-box',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(12px)',
                        borderRight: '1px solid rgba(255, 255, 255, 0.3)',
                    },
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                        <Avatar
                            src={`${process.env.REACT_APP_BASE_URL}/files/preview/${profile.avatarCode}`}
                            sx={{ width: 50, height: 50, mr: 2 }}
                        />
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                                {loading ? 'Loading...' : profile.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Học sinh
                            </Typography>
                        </Box>
                    </Box>

                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                key={item.text}
                                component={motion.div}
                                whileHover={{ x: 8 }}
                                onClick={() => navigate(item.path)}
                                sx={{
                                    mb: 1,
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    backgroundColor: location.pathname === item.path ? 'primary.main' : 'transparent',
                                    color: location.pathname === item.path ? 'white' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: location.pathname === item.path ? 'primary.dark' : 'rgba(0,0,0,0.04)',
                                    },
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: location.pathname === item.path ? 'white' : 'inherit'
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box sx={{ mt: 'auto', p: 2 }}>
                    <ListItem
                        component={motion.div}
                        whileHover={{ x: 8 }}
                        onClick={handleLogout}
                        sx={{
                            borderRadius: 2,
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.04)',
                            },
                        }}
                    >
                        <ListItemIcon>
                            <ExitToApp color="error" />
                        </ListItemIcon>
                        <ListItemText
                            primary="Đăng xuất"
                            primaryTypographyProps={{ color: 'error' }}
                        />
                    </ListItem>
                </Box>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 4,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 200,
                        background: 'linear-gradient(120deg, #2962ff 0%, #1565c0 100%)',
                        borderRadius: '0 0 2rem 2rem',
                        zIndex: 0,
                    }
                }}
            >
                {children}
            </Box>
        </Box>
    );
};
