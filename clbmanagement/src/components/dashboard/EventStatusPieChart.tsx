import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { colors } from '../../theme/colors';

const data = [
    { name: 'Đang diễn ra', value: 8 },
    { name: 'Sắp diễn ra', value: 15 },
    { name: 'Đã kết thúc', value: 25 },
];

const COLORS = [ colors.status.success, colors.status.warning, colors.status.info ];

export const EventStatusPieChart = () => {
    return (
        <Card sx={{
            height: 400,
            p: 2,
            background: colors.background.glassy,
            border: `1px solid ${colors.border.light}`,
            borderRadius: 3,
        }}>
            <Typography variant="h6" sx={{ mb: 2, color: colors.text.primary }}>
                Trạng thái sự kiện
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[ index % COLORS.length ]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
};
