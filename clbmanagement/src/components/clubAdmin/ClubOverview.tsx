import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, Button, DialogContent, DialogActions, Dialog, MenuItem, TextField, DialogTitle, Autocomplete, Chip } from '@mui/material';
import { colors } from '../../theme/colors';
import { createClub, deleteClub, getDetailClub, getMyClubs, updateClub } from '../../services/clubService';
import { getActivitiesInClub } from '../../services/activityService';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { getAllUsers } from '../../services/authService';

export default function ClubOverview() {
    const [clubs, setClubs] = useState<any[]>([]);
    const [clubMembersCount, setClubMembersCount] = useState<Record<number, number>>({});
    const [activitysCount, setActivitysCount] = useState<Record<number, number>>({});

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedClub, setSelectedClub] = useState<any>(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [leaderId, setLeaderId] = useState<number>();
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [memberIds, setMemberIds] = useState<number[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [detail, setDetail] = useState<any>();

    const handleSaveCLB = async () => {
        try {
            setLoading(true);

            // Validate dữ liệu
            if (!name.trim()) {
                toast.error('Vui lòng nhập tên câu lạc bộ');
                return;
            }

            const clubData = {
                name,
                description,
                image,
                leaderId,
                memberIds
            };

            if (dialogMode === 'edit' && selectedClub) {
                console.log('Updating club:', clubData);

                const response = await updateClub(clubData, selectedClub.id);
                if (response) {
                    toast.success('Đã cập nhật thông tin CLB');
                }
                else {
                    toast.error('Đã có lỗi xảy ra khi cập nhật thông tin CLB');
                }
            } else if (dialogMode === 'add') {
                const response = await createClub(clubData);
                if (response) {
                    toast.success('Đã thêm CLB mới');
                } else {
                    toast.error('Đã có lỗi xảy ra khi thêm CLB mới');
                }
            }

            // Làm mới danh sách CLB
            await fetchMyClubs();
            setOpenDialog(false);

            // Reset form
            setName('');
            setDescription('');
            setLeaderId(undefined);
            setMemberIds([]);
        } catch (error) {
            console.error('Error saving club:', error);
            toast.error('Đã có lỗi xảy ra khi lưu thông tin CLB');
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async () => {
        const response = await getAllUsers();
        setUsers(response);
    }

    const fetchMyClubs = async () => {
        try {
            const response = await getMyClubs();
            setClubs(response.data.content || []);
        } catch (error) {
            console.error("Error fetching clubs:", error);
            setClubs([]);
        }
    };

    const fetchClubDetails = async (clubId: number) => {
        try {
            const response = await getDetailClub(clubId);
            const response2 = await getActivitiesInClub(clubId, '', 0, 1000);
            const memberCount = response.data.membership?.length || 0;
            const activityCount = response2.data.content.length || 0;

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
        } catch (error) {
            console.error(`Error fetching details for club ${clubId}:`, error);
        }
    };

    const handleDeleteClub = (clubId: number) => {
        Swal.fire({
            title: 'Xác nhận xóa nhóm?',
            text: 'Hành động này không thể hoàn tác',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: colors.status.error,
            cancelButtonColor: colors.status.info,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteClub(clubId);
                    await fetchMyClubs();
                    toast.success('Đã xóa nhóm');
                } catch (error) {
                    console.error('Error deleting activity:', error);
                    toast.error('Đã có lỗi xảy ra khi xóa nhóm');
                }
            }
        });
    }

    const handleAddCLB = () => {
        setDialogMode('add');
        setSelectedClub(null);
        setOpenDialog(true);
    };

    const getDetail = async (id: number) => {
        const response = await getDetailClub(id);
        setDetail(response.data);
    }

    useEffect(() => {
        fetchMyClubs();
        fetchAllUsers();
    }, []);

    // Khi danh sách clubs thay đổi, fetch chi tiết cho mỗi club
    useEffect(() => {
        clubs.forEach(club => {
            if (club && club.id) {
                fetchClubDetails(club.id);
            }
        });
    }, [clubs]);

    return (
        clubs.length > 0 ? (
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ px: 3, py: 1, mb: 3 }}
                    onClick={handleAddCLB}
                >
                    Thêm CLB
                </Button>
                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(false)}
                    maxWidth="sm"
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
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                            <TextField
                                label="Tên CLB"
                                fullWidth
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Nhập mô tả CLB"
                                style={{ padding: '10px', borderRadius: '5px', height: '200px' }}
                            />
                            <TextField
                                select
                                label="Trưởng CLB"
                                fullWidth
                                value={leaderId || ''}
                                onChange={(e) => setLeaderId(Number(e.target.value))}
                            >
                                {users.map((user: any) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.name || user.username || 'Không có tên'}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <Autocomplete
                                multiple
                                id="members-select"
                                options={users}
                                getOptionLabel={(option) => option.name || option.username || option.email || 'Không có tên'}
                                value={users.filter(user => memberIds.includes(user.id))}
                                onChange={(event, newValue) => {
                                    setMemberIds(newValue.map(user => user.id));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Chọn thành viên"
                                        placeholder="Tìm kiếm theo tên"
                                    />
                                )}
                                renderTags={(value, getTagProps) =>
                                    value.map((option, index) => (
                                        <Chip
                                            label={option.name || option.username || option.email}
                                            {...getTagProps({ index })}
                                            key={option.id}
                                        />
                                    ))
                                }
                            />
                            <Box sx={{
                                border: '1px dashed #ccc',
                                borderRadius: 1,
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 1
                            }}>
                                <Typography variant="body2">Ảnh CLB</Typography>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    sx={{ mt: 1 }}
                                >
                                    Chọn file hình ảnh
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            // Handle file change logic here
                                            console.log(e.target.files?.[0]);
                                            setImage(e.target.files?.[0] || null);
                                        }}
                                    />
                                </Button>
                                {image && (
                                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                                        <Typography variant="caption">Ảnh đã chọn</Typography>
                                        <Box
                                            component="img"
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            sx={{
                                                maxWidth: '100%',
                                                maxHeight: '150px',
                                                mt: 1,
                                                borderRadius: 1
                                            }}
                                        />
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                        <Button
                            variant="contained"
                            onClick={handleSaveCLB}
                            sx={{ background: colors.primary.gradient }}
                            disabled={loading}
                        >
                            {dialogMode === 'add' ? 'Thêm' : 'Lưu thay đổi'}
                        </Button>
                    </DialogActions>
                </Dialog>
                {
                    clubs.map((club: any) => (
                        <Box key={club.id} sx={{ mb: 5 }}>
                            <Box>
                                <Typography variant="h5" sx={{ mb: 3 }}>Tổng quan CLB {club.name}</Typography>
                            </Box>

                            <Box>
                            <img
                                src={`${process.env.REACT_APP_BASE_URL}/files/preview/${club.imageCode}`}
                                alt={club.name}
                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                            />
                            </Box>

                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Thông tin thành viên</Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Số thành viên:</strong> {clubMembersCount[club.id] ?? 'Đang tải...'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" sx={{ mb: 2 }}>Thông tin hoạt động</Typography>
                                            <Typography variant="body2" sx={{ mb: 1 }}>
                                                <strong>Số hoạt động:</strong> {activitysCount[club.id] ?? 'Đang tải...'}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ px: 3, py: 1, mr: 2 }}
                                    onClick={async () => {
                                        try {
                                            setDialogMode('edit');
                                            setSelectedClub(club);

                                            // Đợi API call hoàn thành và lấy dữ liệu
                                            const response = await getDetailClub(club.id);
                                            const detailData = response.data;

                                            // Cập nhật state với dữ liệu từ API
                                            setName(detailData.club?.name || club.name || '');
                                            setDescription(detailData.club?.description || club.description || '');

                                            // Tìm ID của leader từ danh sách thành viên
                                            if (detailData.membership && Array.isArray(detailData.membership)) {
                                                // Tìm thành viên có vai trò là leader
                                                const leader = detailData.membership.find(member =>
                                                    member.roleInClub === 'leader' ||
                                                    member.role === 'leader');

                                                if (leader) {
                                                    const leaderId = leader.userId || leader.user?.id || leader.id;
                                                    setLeaderId(leaderId);
                                                }

                                                // Lấy tất cả memberIds
                                                const ids = detailData.membership.map(member => {
                                                    return member.userId || member.user?.id || member.id;
                                                }).filter(Boolean);

                                                setMemberIds(ids);
                                            } else {
                                                setLeaderId(undefined);
                                                setMemberIds([]);
                                            }

                                            setImage(null);
                                            setOpenDialog(true);
                                        } catch (error) {
                                            console.error('Error fetching club details:', error);
                                            toast.error('Không thể tải thông tin CLB');
                                        }
                                    }}
                                >
                                    Chỉnh sửa
                                </Button>

                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ px: 3, py: 1 }}
                                    onClick={() => handleDeleteClub(club.id)}
                                >
                                    Xóa CLB
                                </Button>
                            </Box>
                            <ToastContainer />
                        </Box>
                    ))
                }
            </Box>) : (
            <Card sx={{ p: 4, textAlign: 'center' }}>
                <CardContent>
                    <Typography variant="h6">
                        Vui lòng chọn CLB để xem thông tin chi tiết
                    </Typography>
                </CardContent>
            </Card>
        )
    );
}