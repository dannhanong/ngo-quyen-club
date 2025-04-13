import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Grid, Tabs, Tab } from '@mui/material';
import { Search } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ClubEventCard } from '../../components/student/ClubEventCard';
import { StudentLayout } from '../../layouts/StudentLayout';

const mockEvents = [
    {
        id: 1,
        title: "Triển lãm Nghệ thuật Xuân 2024",
        clubName: "CLB Mỹ thuật",
        date: "20/01/2024",
        location: "Sảnh A - Tòa nhà B",
        image: "https://source.unsplash.com/random/800x600/?art",
        status: 'upcoming' as const
    },
    // Add more events...
];

export default function Events() {
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ tabValue, setTabValue ] = useState(0);

    const filteredEvents = mockEvents.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.clubName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <StudentLayout>
            <Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom color="white">
                    Sự kiện
                </Typography>

                <Box sx={{ mb: 4, display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
                    <TextField
                        placeholder="Tìm kiếm sự kiện..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                background: 'rgba(255, 255, 255, 0.9)',
                                backdropFilter: 'blur(10px)',
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Tabs
                        value={tabValue}
                        onChange={(e, v) => setTabValue(v)}
                        sx={{
                            minWidth: 300,
                            background: 'rgba(255, 255, 255, 0.9)',
                            borderRadius: 2,
                            '& .MuiTab-root': { flex: 1 }
                        }}
                    >
                        <Tab label="Tất cả" />
                        <Tab label="CLB của tôi" />
                    </Tabs>
                </Box>

                <Grid container spacing={3}>
                    {filteredEvents.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <ClubEventCard
                                    event={event}
                                    onViewDetails={(id) => console.log('View event', id)}
                                />
                            </motion.div>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </StudentLayout>
    );
}
