import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, Avatar, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { Group, EventNote, People } from '@mui/icons-material';
import { StudentLayout } from '../../layouts/StudentLayout';
import { ClubMembersList } from '../../components/student/ClubMembersList';
import { getMyClubs } from '../../services/clubService';

const mockMyClubs = [
    {
        id: 1,
        name: 'CLB Mỹ Thuật',
        avatar: 'https://source.unsplash.com/random/100x100/?art',
        role: 'Thành viên',
        memberCount: 45,
        nextEvent: 'Triển lãm Xuân 2024',
        eventDate: '20/01/2024'
    },
    // Add more clubs...
];

const mockMembers = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        role: 'Trưởng CLB',
        avatar: 'https://source.unsplash.com/random/100x100/?person1',
        joinDate: '01/01/2023',
        status: 'active' as const
    },
    {
        id: 2,
        name: 'Trần Thị B',
        role: 'Phó CLB',
        avatar: 'https://source.unsplash.com/random/100x100/?person2',
        joinDate: '02/01/2023',
        status: 'active' as const
    },
    {
        id: 3,
        name: 'Lê Văn C',
        role: 'Thành viên',
        avatar: 'https://source.unsplash.com/random/100x100/?person3',
        joinDate: '03/01/2023',
        status: 'active' as const
    },
    // Add more members...
];

export default function MyClubs() {
    const [ selectedClub, setSelectedClub ] = useState<string | null>(null);
    const [ openMembers, setOpenMembers ] = useState(false);
    const [ clubs, setClubs ] = useState<any[]>([]);

    const handleViewMembers = (clubName: string) => {
        setSelectedClub(clubName);
        setOpenMembers(true);
    };

    const fetchClubs = async () => {
        const response = await getMyClubs();
        setClubs(response.data.content);
    };

    useEffect(() => {
        fetchClubs();
    }, []);

    return (
        <StudentLayout>
            <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="white" mb={4}>
                    CLB của tôi
                </Typography>

                <Grid container spacing={3}>
                    {clubs.map((club) => (
                        <Grid item xs={12} md={6} key={club.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card sx={{
                                    p: 3,
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2
                                }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar src={club.avatar} sx={{ width: 60, height: 60 }} />
                                        <Box>
                                            <Typography variant="h6">{club.name}</Typography>
                                            <Chip
                                                label={club.role}
                                                size="small"
                                                color="primary"
                                                sx={{ mt: 0.5 }}
                                            />
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <People color="action" />
                                            <Typography variant="body2">
                                                {club.memberCount} thành viên
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EventNote color="action" />
                                            <Typography variant="body2">
                                                Sự kiện tiếp theo: {club.eventDate}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Typography variant="body1">
                                        Sự kiện sắp tới: {club.nextEvent}
                                    </Typography>

                                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={() => handleViewMembers(club.name)}
                                        >
                                            Xem thành viên
                                        </Button>
                                        <Button variant="outlined" color="error" fullWidth>
                                            Rời CLB
                                        </Button>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>

                <ClubMembersList
                    open={openMembers}
                    onClose={() => setOpenMembers(false)}
                    clubName={selectedClub || ''}
                    members={mockMembers}
                />
            </Box>
        </StudentLayout>
    );
}
