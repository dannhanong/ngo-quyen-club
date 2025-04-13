import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Tabs,
    Tab,
    TextField,
    InputAdornment,
    Chip,
    Container,
    Paper
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { ClubEventCard } from '../components/student/ClubEventCard';
import { ClubPostCard } from '../components/student/ClubPostCard';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer, scaleIn, pageTransition } from '../styles/animations';
import { StudentLayout } from '../layouts/StudentLayout';
import { getProfile } from '../services/authService';

// Mock data for demonstration
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

const mockPosts = [
    {
        id: 1,
        clubName: "CLB Mỹ thuật",
        author: "Nguyễn Văn A",
        date: "2 giờ trước",
        content: "Chào mừng các bạn đến với buổi triển lãm sắp tới của CLB chúng mình! Đừng quên đăng ký tham gia nhé.",
        likes: 24,
        comments: 5,
        clubAvatar: "https://source.unsplash.com/random/100x100/?art"
    },
    // Add more posts...
];

const mockUserClubs = [ "CLB Mỹ thuật", "CLB Âm nhạc", "CLB Nhiếp ảnh" ];

export default function Home() {
    const [ tabValue, setTabValue ] = useState(0);
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ selectedClub, setSelectedClub ] = useState<string | null>(null);
    const [ profile, setProfile ] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const filteredEvents = mockEvents.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.clubName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredPosts = mockPosts.filter(post =>
        (!selectedClub || post.clubName === selectedClub) &&
        mockUserClubs.includes(post.clubName)
    );

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
        !loading && (
            <StudentLayout>
            <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageTransition}
                >
                    {/* Welcome Card */}
                    <Paper sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        color: 'white',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 100%)',
                    }}>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Xin chào, {profile ? profile.name : 'Học sinh'}
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.8 }}>
                            Câu lạc bộ của bạn: {mockUserClubs.join(" • ")}
                        </Typography>
                    </Paper>

                    {/* Content Section */}
                    <Paper sx={{
                        p: 3,
                        borderRadius: 3,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                    }}>
                        {/* Tabs and Search */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 3,
                            mb: 4,
                            flexWrap: 'wrap'
                        }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                sx={{
                                    '& .MuiTab-root': {
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        minWidth: 120,
                                        transition: 'all 0.3s ease',
                                    }
                                }}
                            >
                                <Tab label="Sự kiện" />
                                <Tab label="Bài đăng CLB" />
                            </Tabs>
                            <TextField
                                placeholder={tabValue === 0 ? "Tìm kiếm sự kiện..." : "Tìm kiếm bài đăng..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{
                                    flex: 1,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
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
                        </Box>

                        {/* Content */}
                        {tabValue === 0 ? (
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                            >
                                <Grid container spacing={3}>
                                    {filteredEvents.map((event) => (
                                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                                            <motion.div variants={scaleIn}>
                                                <ClubEventCard
                                                    event={event}
                                                    onViewDetails={(id) => console.log('View event', id)}
                                                />
                                            </motion.div>
                                        </Grid>
                                    ))}
                                </Grid>
                            </motion.div>
                        ) : (
                            <motion.div
                                variants={staggerContainer}
                                initial="initial"
                                animate="animate"
                            >
                                <Box sx={{
                                    mb: 2,
                                    display: 'flex',
                                    gap: 1,
                                    flexWrap: 'wrap',
                                    '& .MuiChip-root': {
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        }
                                    }
                                }}>
                                    <Chip
                                        label="Tất cả"
                                        onClick={() => setSelectedClub(null)}
                                        color={selectedClub === null ? "primary" : "default"}
                                    />
                                    {mockUserClubs.map((club) => (
                                        <Chip
                                            key={club}
                                            label={club}
                                            onClick={() => setSelectedClub(club)}
                                            color={selectedClub === club ? "primary" : "default"}
                                        />
                                    ))}
                                </Box>

                                <AnimatePresence>
                                    {filteredPosts.map((post) => (
                                        <motion.div
                                            key={post.id}
                                            variants={fadeInUp}
                                            layout
                                        >
                                            <ClubPostCard post={post} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </Paper>
                </motion.div>
            </Container>
        </StudentLayout>
        )
    );
}
