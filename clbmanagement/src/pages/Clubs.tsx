import React, { useState } from 'react';
import {
    Box, Typography, Grid, Card, Button, Avatar,
    TextField, InputAdornment, IconButton, Chip,
    Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Add, Search, FilterList, Edit, Delete, MoreVert } from '@mui/icons-material';
import { ClubForm } from '../components/ClubForm';

const mockClubs = [
    {
        id: 1,
        name: 'CLB Mỹ Thuật',
        description: 'Câu lạc bộ dành cho những học sinh yêu thích nghệ thuật và hội họa',
        members: 25,
        leader: 'Nguyễn Văn A',
        meetingDay: 'Thứ 2, Thứ 4',
        image: 'https://source.unsplash.com/random/400x200/?art',
        category: 'Nghệ thuật',
    },
    {
        id: 2,
        name: 'CLB Bóng Đá',
        description: 'Câu lạc bộ dành cho những học sinh đam mê bóng đá',
        members: 30,
        leader: 'Trần Văn B',
        meetingDay: 'Thứ 3, Thứ 5',
        image: 'https://source.unsplash.com/random/400x200/?soccer',
        category: 'Thể thao',
    },
    // Add more mock data as needed
];

export default function Clubs() {
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ openDialog, setOpenDialog ] = useState(false);
    const [ selectedClub, setSelectedClub ] = useState<any>(null);

    const handleAddClub = () => {
        setSelectedClub(null);
        setOpenDialog(true);
    };

    const handleEditClub = (club: any) => {
        setSelectedClub(club);
        setOpenDialog(true);
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h4" fontWeight="bold">
                    Danh Sách Câu Lạc Bộ
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddClub}
                    sx={{
                        background: 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #4338ca 0%, #6366f1 100%)',
                        },
                    }}
                >
                    Thêm CLB Mới
                </Button>
            </Box>

            {/* Search and Filter */}
            <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm câu lạc bộ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
                <IconButton>
                    <FilterList />
                </IconButton>
            </Box>

            {/* Clubs Grid */}
            <Grid container spacing={3}>
                {mockClubs.map((club) => (
                    <Grid item xs={12} sm={6} md={4} key={club.id}>
                        <Card sx={{
                            p: 2,
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            },
                        }}>
                            <Box sx={{ position: 'relative', mb: 2 }}>
                                <img
                                    src={club.image}
                                    alt={club.name}
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                    }}
                                />
                                <Box sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    display: 'flex',
                                    gap: 1,
                                }}>
                                    <IconButton size="small" onClick={() => handleEditClub(club)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton size="small">
                                        <Delete />
                                    </IconButton>
                                </Box>
                            </Box>

                            <Typography variant="h6" gutterBottom>{club.name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {club.description}
                            </Typography>

                            <Box sx={{ mt: 'auto' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Avatar sx={{ width: 24, height: 24, mr: 1 }} />
                                    <Typography variant="body2">{club.leader}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Chip label={`${club.members} thành viên`} size="small" />
                                    <Chip label={club.category} color="primary" variant="outlined" size="small" />
                                </Box>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add/Edit Club Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedClub ? 'Chỉnh sửa CLB' : 'Thêm CLB mới'}
                </DialogTitle>
                <DialogContent>
                    {/* <ClubForm initialData={selectedClub} /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button variant="contained" onClick={() => setOpenDialog(false)}>
                        {selectedClub ? 'Lưu thay đổi' : 'Thêm CLB'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
