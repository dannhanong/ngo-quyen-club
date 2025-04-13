import React from 'react';
import {
    Box,
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Avatar,
    AvatarGroup,
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import { colors } from '../../theme/colors';

const mockEvents = [
    {
        id: 1,
        name: "Triển lãm nghệ thuật mùa xuân",
        club: "CLB Mỹ Thuật",
        startDate: "2024-01-15",
        endDate: "2024-01-20",
        location: "Hội trường A1",
        participants: 45,
        status: "ongoing",
    },
    {
        id: 2,
        name: "Đêm nhạc acoustic",
        club: "CLB Âm nhạc",
        startDate: "2024-01-18",
        endDate: "2024-01-18",
        location: "Sân trường",
        participants: 120,
        status: "upcoming",
    },
    // Thêm mock data khác...
];

export const ActiveEventsList = () => {
    return (
        <Box>
            <TableContainer component={Card} sx={{
                mt: 3,
                borderRadius: 3,
                background: colors.background.glassy,
                border: `1px solid ${colors.border.light}`,
            }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên sự kiện</TableCell>
                            <TableCell>CLB tổ chức</TableCell>
                            <TableCell>Thời gian</TableCell>
                            <TableCell>Địa điểm</TableCell>
                            <TableCell align="center">Số người tham gia</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockEvents.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {event.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>{event.club}</TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="caption" display="block">
                                            Bắt đầu: {event.startDate}
                                        </Typography>
                                        <Typography variant="caption" display="block">
                                            Kết thúc: {event.endDate}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={`${event.participants} người`}
                                        size="small"
                                        color="primary"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={event.status === 'ongoing' ? 'Đang diễn ra' : 'Sắp diễn ra'}
                                        color={event.status === 'ongoing' ? 'success' : 'warning'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="primary">
                                        <Visibility />
                                    </IconButton>
                                    <IconButton size="small" color="info">
                                        <Edit />
                                    </IconButton>
                                    <IconButton size="small" color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
