import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText,
    Grid, TextField, Button, Avatar, Divider, IconButton
} from '@mui/material';
import {
    Security, Edit, Lock, Mail, Phone, School,
    Notifications, Language
} from '@mui/icons-material';
import { StudentLayout } from '../../layouts/StudentLayout';
import { motion } from 'framer-motion';
import { EditProfileDialog } from '../../components/student/EditProfileDialog';
import { getProfile } from '../../services/authService';
import { CircularProgress } from '@mui/material';

export default function Settings() {
    const [openEditProfile, setOpenEditProfile] = useState(false);
    const [profile, setProfile] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(false);

    const fetchProfile = async () => {
        setLoading(true);
        const response = await getProfile();
        setProfile(response);
        setLoading(false);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <StudentLayout>
            <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="white" mb={4}>
                    Cài đặt
                </Typography>

                <Grid container spacing={3}>
                    {/* Profile Section */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{
                            p: 3,
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            textAlign: 'center'
                        }}>
                            <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                                <Avatar
                                    src={profile && profile.avatarCode 
                                        ? `${process.env.REACT_APP_BASE_URL}/files/preview/${profile.avatarCode}`
                                        : "/static/images/default-avatar.png"} // Thêm avatar mặc định
                                    sx={{ width: 120, height: 120 }}
                                />
                                <IconButton
                                    sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        backgroundColor: 'primary.main',
                                        color: 'white',
                                        '&:hover': { backgroundColor: 'primary.dark' }
                                    }}
                                    size="small"
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                            </Box>
                            <Typography variant="h6" gutterBottom>
                                {loading ? <CircularProgress size={20} /> : profile.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Học sinh
                            </Typography>
                            <Button
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={() => setOpenEditProfile(true)}
                            >
                                Chỉnh sửa hồ sơ
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Settings Sections */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 3,
                            overflow: 'hidden'
                        }}>
                            {/* Personal Information */}
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Thông tin cá nhân
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            value={profile && profile.email ? profile.email : 'Chưa có'}
                                            InputProps={{
                                                startAdornment: <Mail sx={{ mr: 1, color: 'text.secondary' }} />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Số điện thoại"
                                            value={profile && profile.phone ? profile.phoneNumber : 'Chưa có'}
                                            InputProps={{
                                                startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Trường"
                                            value="THCS Ngô Quyền"
                                            InputProps={{
                                                startAdornment: <School sx={{ mr: 1, color: 'text.secondary' }} />
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>

                            <Divider />

                            {/* Preferences */}
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" gutterBottom>
                                    Tùy chọn
                                </Typography>
                                <List>
                                    <ListItem
                                        component={motion.div}
                                        whileHover={{ x: 8 }}
                                    >
                                        <ListItemIcon>
                                            <Notifications color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Cài đặt thông báo"
                                            secondary="Quản lý thông báo từ CLB và sự kiện"
                                        />
                                    </ListItem>
                                    <ListItem
                                        component={motion.div}
                                        whileHover={{ x: 8 }}
                                    >
                                        <ListItemIcon>
                                            <Security color="primary" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary="Bảo mật"
                                            secondary="Thay đổi mật khẩu và cài đặt bảo mật"
                                        />
                                    </ListItem>

                                </List>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <EditProfileDialog
                open={openEditProfile}
                onClose={() => setOpenEditProfile(false)}
                userData={profile}
            />
        </StudentLayout>
    );
}
