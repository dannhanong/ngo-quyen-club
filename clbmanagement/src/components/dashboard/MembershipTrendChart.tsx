import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { colors } from '../../theme/colors';

const data = [
    { month: 'T1', members: 320 },
    { month: 'T2', members: 350 },
    { month: 'T3', members: 400 },
    { month: 'T4', members: 450 },
    { month: 'T5', members: 500 },
    { month: 'T6', members: 550 },
];

export const MembershipTrendChart = () => {
    return (
        <Card sx={{
            height: 400,
            p: 2,
            background: colors.background.glassy,
            border: `1px solid ${colors.border.light}`,
            borderRadius: 3,
        }}>
            <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
                Xu hướng thành viên
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="members"
                        stroke={colors.primary.main}
                        strokeWidth={2}
                        dot={{ fill: colors.primary.main }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};
