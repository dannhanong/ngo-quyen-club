import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Typography, Card, Tabs, Tab, Button,
    Dialog, DialogTitle, DialogContent, DialogActions,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, IconButton, Chip, Badge
} from '@mui/material';
import { Add, Edit, Delete, CheckCircle, Cancel, Visibility, People, Groups, EventNote, BarChart, Assignment, Event, Article, Search } from '@mui/icons-material';
import { ClubForm } from '../components/ClubForm';
import { PostApprovalList } from '../components/PostApprovalList';
import StatisticsCard from '../components/StatisticsCard';
import UserManagement from '../components/UserManagement';
import { keyframes } from '@emotion/react';
import { colors } from '../theme/colors';
import { ClubActivityChart } from '../components/dashboard/ClubActivityChart';
import { MembershipTrendChart } from '../components/dashboard/MembershipTrendChart';
import { EventStatusPieChart } from '../components/dashboard/EventStatusPieChart';
import { ActiveEventsList } from '../components/dashboard/ActiveEventsList';
import { PostManagement } from '../components/dashboard/PostManagement';
import { TextField, InputAdornment } from '@mui/material';
import { getAllClubs, getDetailClub } from '../services/clubService';
import { getActivitiesInClub } from '../services/activityService';

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

interface DashboardStats {
    totalUsers: number;
    totalClubs: number;
    activeEvents: number;
    totalPosts: number;
}

export default function AdminDashboard() {
    const [ tabValue, setTabValue ] = useState(0);
    const [ openDialog, setOpenDialog ] = useState(false);
    const [ dialogMode, setDialogMode ] = useState<'add' | 'edit'>('add');
    const [ searchQuery, setSearchQuery ] = useState('');
    const [ clubs, setClubs ] = useState<any[]>([]);
    const [clubMembersCount, setClubMembersCount] = useState<Record<number, number>>({});
    const [activitysCount, setActivitysCount] = useState<Record<number, number>>({});
    const [clubLeaders, setClubLeaders] = useState<Record<number, string>>({});
    const [clubCharges, setClubCharges] = useState<Record<number, string>>({});
    

    const handleAddClub = () => {
        setDialogMode('add');
        setOpenDialog(true);
    };

    const fetchAllClubs = async () => {
        const response = await getAllClubs();
        setClubs(response.data.content);
    }

    const fetchClubDetails = async (clubId: number) => {
        try {
            const response = await getDetailClub(clubId);
            const response2 = await getActivitiesInClub(clubId, '', 0, 1000);
            
            // Lấy dữ liệu từ response
            const clubData = response.data;
            const membership = clubData.membership || [];
            const memberCount = membership.length || 0;
            const activityCount = response2.data.content.length || 0;
    
            // Tìm người dùng có vai trò leader và charge
            const leaderMember = membership.find((m: any) => m.roleInClub === 'leader');
            const chargeMember = membership.find((m: any) => m.roleInClub === 'charge');
    
            // Cập nhật state với số lượng thành viên của club
            setClubMembersCount(prev => ({
                ...prev,
                [clubId]: memberCount
            }));
    
            // Cập nhật state với số lượng hoạt động của club
            setActivitysCount(prev => ({
                ...prev,
                [clubId]: activityCount
            }));
    
            // Cập nhật thông tin của charge và leader
            setClubLeaders(prev => ({
                ...prev,
                [clubId]: leaderMember ? leaderMember.user.name : 'Chưa có'
            }));
    
            setClubCharges(prev => ({
                ...prev,
                [clubId]: chargeMember ? chargeMember.user.name : 'Chưa có'
            }));
        } catch (error) {
            console.error(`Error fetching details for club ${clubId}:`, error);
        }
    };

    useEffect(() => {
        fetchAllClubs();
    }, []);

    useEffect(() => {
        clubs.forEach(club => {
            if (club && club.id) {
                fetchClubDetails(club.id);
            }
        });
    }, [clubs]);

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
                gap: 2,
                boxShadow: colors.shadow.card,
                '& .MuiTab-root': {
                    color: colors.text.secondary,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&.Mui-selected': {
                        background: colors.primary.gradient,
                        color: '#fff',
                        boxShadow: colors.shadow.card
                    },
                    '&:hover:not(.Mui-selected)': {
                        background: colors.background.darker,
                        color: colors.text.accent
                    }
                }
            }}>
                <Typography variant="h5" sx={{
                    color: colors.text.primary,
                    fontWeight: 'bold',
                    mb: 4,
                    textAlign: 'center'
                }}>
                    Bảng điều khiển Admin
                </Typography>

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
                    <Tab icon={<BarChart />} label="Thống kê" iconPosition="start" />
                    <Tab icon={<People />} label="Quản lý người dùng" iconPosition="start" />
                    <Tab icon={<Groups />} label="Quản lý CLB" iconPosition="start" />
                    {/* <Tab icon={<Event />} label="Sự kiện đang diễn ra" iconPosition="start" /> */}
                    {/* <Tab icon={<Article />} label="Quản lý bài đăng" iconPosition="start" /> */}
                </Tabs>
            </Box>

            {/* Main Content */}
            <Box sx={{
                p: 4,
                overflow: 'auto',
                '& .MuiCard-root': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: colors.shadow.hover
                    }
                }
            }}>

                {/* Statistics Grid */}
                {/* <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatisticsCard
                            title="Tổng số người dùng"
                            value={mockStats.totalUsers}
                            icon={People}
                            color={colors.status.info}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatisticsCard
                            title="Tổng số CLB"
                            value={mockStats.totalClubs}
                            icon={Groups}
                            color="#4caf50"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatisticsCard
                            title="Sự kiện đang diễn ra"
                            value={mockStats.activeEvents}
                            icon={EventNote}
                            color="#ff9800"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatisticsCard
                            title="Tổng số bài đăng"
                            value={mockStats.totalPosts}
                            icon={Assignment}
                            color="#f44336"
                        />
                    </Grid>
                </Grid> */}

                {/* Tab Panels with new styling */}
                <Box sx={{
                    background: colors.background.paper,
                    borderRadius: 3,
                    p: 3,
                    minHeight: 400,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    border: `1px solid ${colors.border.light}`,
                }}>
                    <TabPanel value={tabValue} index={0}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={8}>
                                <ClubActivityChart />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <EventStatusPieChart />
                            </Grid>
                            <Grid item xs={12}>
                                <MembershipTrendChart />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                        <UserManagement />
                    </TabPanel>
                    <TabPanel value={tabValue} index={2}>
                        <Box sx={{
                            mb: 3,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <TextField
                                placeholder="Tìm kiếm CLB hoặc trưởng CLB..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                sx={{ flex: 1 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {/* <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleAddClub}
                                sx={{ borderRadius: 2, minWidth: 'fit-content' }}
                            >
                                Thêm CLB mới
                            </Button> */}
                        </Box>

                        <TableContainer
                            component={Paper}
                            sx={{
                                borderRadius: 2,
                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên CLB</TableCell>
                                        <TableCell>Phụ trách</TableCell>
                                        <TableCell>Trưởng CLB</TableCell>
                                        <TableCell align="center">Số thành viên</TableCell>
                                        <TableCell align="center">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clubs.map((club) => (
                                        <TableRow
                                            key={club.id}
                                            sx={{
                                                '&:hover': {
                                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                                }
                                            }}
                                        >
                                            <TableCell>{club.name}</TableCell>
                                            <TableCell>{clubLeaders[club.id] ?? 'Đang tải...'}</TableCell>
                                            <TableCell align="center">{clubCharges[club.id] ?? 'Đang tải...'}</TableCell>
                                            <TableCell align="center">{clubMembersCount[club.id] ?? 'Đang tải...'}</TableCell>
                                            <TableCell align="center">
                                                <IconButton
                                                    color="primary"
                                                    size="small"
                                                    sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                                                >
                                                    <Visibility />
                                                </IconButton>
                                                {/* <IconButton
                                                    color="info"
                                                    size="small"
                                                    sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="error"
                                                    size="small"
                                                    sx={{ '&:hover': { transform: 'scale(1.1)' } }}
                                                >
                                                    <Delete />
                                                </IconButton> */}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </TabPanel>
                    <TabPanel value={tabValue} index={3}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ color: colors.text.primary, fontWeight: 600 }}>
                                Sự kiện đang diễn ra
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                Quản lý và theo dõi các sự kiện đang và sắp diễn ra
                            </Typography>
                        </Box>
                        <ActiveEventsList />
                    </TabPanel>
                    <TabPanel value={tabValue} index={4}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h5" sx={{ color: colors.text.primary, fontWeight: 600 }}>
                                Quản lý bài đăng
                            </Typography>
                            <Typography variant="body2" sx={{ color: colors.text.secondary }}>
                                Xem và quản lý tất cả bài đăng trong hệ thống
                            </Typography>
                        </Box>
                        <PostManagement />
                    </TabPanel>
                </Box>
            </Box>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
                    }
                }}
            >
                <DialogTitle>
                    {dialogMode === 'add' ? 'Thêm CLB mới' : 'Chỉnh sửa thông tin CLB'}
                </DialogTitle>
                <DialogContent>
                    <ClubForm />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button variant="contained" onClick={() => setOpenDialog(false)}>
                        {dialogMode === 'add' ? 'Thêm' : 'Lưu thay đổi'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
