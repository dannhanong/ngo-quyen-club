import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Typography, Tabs, Tab, Select, MenuItem,
    FormControl, InputLabel, Card, CardContent
} from '@mui/material';
import { People, Event, Article, Dashboard } from '@mui/icons-material';
import { colors } from '../theme/colors';
import StatisticsCard from '../components/StatisticsCard';
import ClubEventManagement from '../components/clubAdmin/ClubEventManagement';
import ClubPostManagement from '../components/clubAdmin/ClubPostManagement';
import ClubOverview from '../components/clubAdmin/ClubOverview';
import ClubMemberManagement from '../components/clubAdmin/ClubMemberManagement';
import { getMyClubs } from '../services/clubService';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <Box role="tabpanel" hidden={value !== index} {...other} sx={{ py: 3 }}>
            {value === index && children}
        </Box>
    );
}

export default function ClubAdminDashboard() {
    const [ tabValue, setTabValue ] = useState(0);
    const [ selectedClub, setSelectedClub ] = useState('');
    const [ clubs, setClubs ] = useState([]);

    const handleClubChange = (event: any) => {
        setSelectedClub(event.target.value);
    };

    const fetchMyClubs = async () => {
        const response = await getMyClubs();
        setClubs(response.data.content);
    };

    useEffect(() => {
        fetchMyClubs();
    }, []);

    return (
        <Box sx={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            minHeight: '100vh',
            background: colors.background.gradient
        }}>
            {/* Sidebar */}
            <Box sx={{
                background: colors.background.glassy,
                borderRight: `2px solid ${colors.border.light}`,
                padding: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>
                    Quản lý CLB
                </Typography>

                <FormControl fullWidth sx={{ mb: 4 }}>
                    <InputLabel>Chọn CLB</InputLabel>
                    <Select
                        value={selectedClub}
                        label="Chọn CLB"
                        onChange={handleClubChange}
                    >
                        {clubs.map(club => (
                            <MenuItem key={club.id} value={club.id}>
                                {club.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Tabs
                    orientation="vertical"
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    sx={{
                        '& .MuiTab-root': {
                            alignItems: 'flex-start',
                            color: colors.text.secondary,
                            textAlign: 'left',
                            textTransform: 'none',
                            fontSize: '1rem',
                            minHeight: 48,
                            borderRadius: 1,
                            mb: 1,
                            '&.Mui-selected': {
                                color: colors.primary.main,
                                background: colors.primary.main + '10',
                            }
                        }
                    }}
                >
                    <Tab icon={<Dashboard />} label="Tổng quan" iconPosition="start" />
                    <Tab icon={<People />} label="Quản lý thành viên" iconPosition="start" />
                    <Tab icon={<Event />} label="Quản lý hoạt động" iconPosition="start" />
                </Tabs>
            </Box>

            {/* Main Content */}
            <Box sx={{ p: 4, overflow: 'auto' }}>
                {selectedClub || (!selectedClub && tabValue === 0) ? (
                    <>
                        {/* Statistics Overview */}
                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} md={4}>
                                <StatisticsCard
                                    title="Tổng số thành viên"
                                    value={clubs.find(c => c.id === selectedClub)?.memberCount || 0}
                                    icon={People}
                                    color={colors.status.info}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <StatisticsCard
                                    title="Sự kiện đang diễn ra"
                                    value={clubs.find(c => c.id === selectedClub)?.eventCount || 0}
                                    icon={Event}
                                    color={colors.status.warning}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <StatisticsCard
                                    title="Tổng số bài đăng"
                                    value={clubs.find(c => c.id === selectedClub)?.postCount || 0}
                                    icon={Article}
                                    color={colors.status.success}
                                />
                            </Grid>
                        </Grid>

                        {/* Tab Panels */}
                        <Box sx={{
                            background: colors.background.paper,
                            borderRadius: 3,
                            p: 3,
                            minHeight: 400,
                            boxShadow: colors.shadow.card
                        }}>
                            <TabPanel value={tabValue} index={0}>
                                <ClubOverview />
                            </TabPanel>
                            <TabPanel value={tabValue} index={1}>
                                <ClubMemberManagement clubId={selectedClub} />
                            </TabPanel>
                            <TabPanel value={tabValue} index={2}>
                                <ClubEventManagement clubId={selectedClub} />
                            </TabPanel>
                            <TabPanel value={tabValue} index={3}>
                                <ClubPostManagement clubId={selectedClub} />
                            </TabPanel>
                        </Box>
                    </>
                ) : (
                    <Card sx={{ p: 4, textAlign: 'center' }}>
                        <CardContent>
                            <Typography variant="h6">
                                Vui lòng chọn CLB để xem thông tin chi tiết
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Box>
        </Box>
    );
}
