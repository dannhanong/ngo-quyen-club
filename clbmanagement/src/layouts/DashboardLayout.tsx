import React, { useState } from 'react';
import {
    Box, Drawer, List, ListItemIcon, ListItemText, IconButton, Typography,
    useTheme, styled, ListItemButton, AppBar, Toolbar, Badge, Avatar,
    Menu, MenuItem, Divider, Stack, Button
} from '@mui/material';
import {
    Dashboard, People, Groups, Event, Settings, Menu as MenuIcon,
    ChevronLeft, NotificationsOutlined, Search, Apps
} from '@mui/icons-material';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const drawerWidth = 280;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 2),
    height: 64,
    justifyContent: 'space-between',
}));

const Main = styled('main')<{ open?: boolean }>(({ theme, open }) => ({
    flexGrow: 1,
    padding: 0,
    backgroundColor: theme.palette.background.default,
    transition: theme.transitions.create([ 'margin', 'padding' ], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: open ? drawerWidth : 0,
    [ theme.breakpoints.down('md') ]: {
        marginLeft: 0,
        padding: theme.spacing(2),
    },
}));

const menuItems = [
    { text: 'Tổng quan', icon: <Dashboard />, path: '/' },
    { text: 'Học sinh', icon: <People />, path: '/students' },
    { text: 'Câu lạc bộ', icon: <Groups />, path: '/clubs' },
    { text: 'Sự kiện', icon: <Event />, path: '/events' },
    { text: 'Cài đặt', icon: <Settings />, path: '/settings' },
];

export default function DashboardLayout() {
    const [ open, setOpen ] = useState(true);
    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box sx={{ display: 'flex', backgroundColor: 'background.default' }}>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { md: `calc(100% - ${open ? drawerWidth : 0}px)` },
                    ml: { md: open ? `${drawerWidth}px` : 0 },
                    backgroundColor: 'background.paper',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton
                            color="inherit"
                            onClick={() => setOpen(!open)}
                            sx={{ display: { md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Button
                            startIcon={<Search />}
                            sx={{
                                color: 'text.secondary',
                                backgroundColor: 'action.hover',
                                '&:hover': { backgroundColor: 'action.selected' },
                                display: { xs: 'none', sm: 'flex' },
                            }}
                        >
                            Tìm kiếm...
                        </Button>
                    </Stack>

                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton>
                            <Badge badgeContent={3} color="primary">
                                <NotificationsOutlined />
                            </Badge>
                        </IconButton>
                        <IconButton>
                            <Apps />
                        </IconButton>
                        <Avatar
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                            sx={{
                                cursor: 'pointer',
                                bgcolor: 'primary.main',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.1)' },
                            }}
                        >
                            A
                        </Avatar>
                    </Stack>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                        borderRight: 'none',
                        backgroundImage: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)',
                        color: 'white',
                    },
                }}
            >
                <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #fff, #e3f2fd)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        School Clubs
                    </Typography>
                </Box>

                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

                <List sx={{ p: 2 }}>
                    {menuItems.map((item) => (
                        <ListItemButton
                            key={item.text}
                            selected={location.pathname === item.path}
                            onClick={() => navigate(item.path)}
                            sx={{
                                mb: 1,
                                borderRadius: 2,
                                '&.Mui-selected': {
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.15)',
                                    },
                                },
                                '&:hover': {
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontSize: '0.9rem',
                                    fontWeight: item.path === location.pathname ? 600 : 400,
                                }}
                            />
                            {item.path === location.pathname && (
                                <Box
                                    sx={{
                                        width: 4,
                                        height: 32,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        ml: 2,
                                    }}
                                />
                            )}
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Main open={open}>
                <Toolbar />
                <Box sx={{ p: 3 }}>
                    <Outlet />
                </Box>
            </Main>

            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={!open}
                onClose={() => setOpen(true)}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        backgroundImage: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)',
                        color: 'white',
                    },
                }}
            >
                {/* Same content as permanent drawer */}
            </Drawer>
        </Box>
    );
}
