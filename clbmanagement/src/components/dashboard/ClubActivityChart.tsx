import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { colors } from '../../theme/colors';

const data = [
    { name: 'CLB Mỹ Thuật', posts: 65, events: 24 },
    { name: 'CLB Âm Nhạc', posts: 45, events: 18 },
    { name: 'CLB Võ Thuật', posts: 38, events: 12 },
    { name: 'CLB Nhiếp Ảnh', posts: 52, events: 29 },
    { name: 'CLB Guitar', posts: 47, events: 15 },
];

export const ClubActivityChart = () => {
    return (
        <Card sx={{
            height: 400,
            p: 2,
            background: colors.background.glassy,
            border: `1px solid ${colors.border.light}`,
            borderRadius: 3,
        }}>
            <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
                Hoạt động của CLB
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="posts" name="Bài đăng" fill={colors.primary.main} />
                    <Bar dataKey="events" name="Sự kiện" fill={colors.secondary.main} />
                </BarChart>
            </ResponsiveContainer>
        </Card>
    );
};
