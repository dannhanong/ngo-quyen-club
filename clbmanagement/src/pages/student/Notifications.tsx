import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, ListItemText, Avatar, IconButton, Paper } from '@mui/material';
import { Delete, Event, Group, Announcement } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { StudentLayout } from '../../layouts/StudentLayout';

const mockNotifications = [
    {
        id: 1,
        type: 'event',
        title: 'Sự kiện mới từ CLB Mỹ thuật',
        content: 'Triển lãm Xuân 2024 sẽ diễn ra vào ngày 20/01/2024',
        time: '2 giờ trước',
        icon: <Event color="primary" />
    },
    {
        id: 2,
        type: 'club',
        title: 'Yêu cầu tham gia được chấp nhận',
        content: 'Bạn đã trở thành thành viên CLB Âm nhạc',
        time: '1 ngày trước',
        icon: <Group color="success" />
    },
    // Add more notifications...
];

export default function Notifications() {
    return (
        <StudentLayout>
            <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="white" mb={4}>
                    Thông báo
                </Typography>

                <Paper sx={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 3,
                }}>
                    <List>
                        {mockNotifications.map((notification, index) => (
                            <motion.div
                                key={notification.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ListItem
                                    sx={{
                                        borderBottom: index < mockNotifications.length - 1 ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                        }
                                    }}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="delete">
                                            <Delete />
                                        </IconButton>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                                            {notification.icon}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={notification.title}
                                        secondary={
                                            <React.Fragment>
                                                <Typography component="span" variant="body2">
                                                    {notification.content}
                                                </Typography>
                                                <br />
                                                <Typography component="span" variant="caption" color="text.secondary">
                                                    {notification.time}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </motion.div>
                        ))}
                    </List>
                </Paper>
            </Box>
        </StudentLayout>
    );
}
