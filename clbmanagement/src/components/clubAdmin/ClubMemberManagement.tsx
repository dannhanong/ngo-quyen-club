import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Chip
} from '@mui/material';
import { Add, Edit, Delete, Email } from '@mui/icons-material';
import { colors } from '../../theme/colors';
import { addMemberToClub, deleteUserFromClub, getDetailClub, updateMemberShip } from '../../services/clubService';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

interface ClubMemberManagementProps {
    clubId: string;
}

export default function ClubMemberManagement({ clubId }: ClubMemberManagementProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedMember, setSelectedMember] = useState(null);
    const [members, setMembers] = useState([]);
    const [roleInClub, setRoleInClub] = useState('member');
    const [status, setStatus] = useState('active');

    // Thêm state để quản lý trạng thái form
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('member');
    const [loading, setLoading] = useState(false);

    const fetchMembers = async (clubId: number) => {
        const response = await getDetailClub(clubId);
        setMembers(response.data.membership);
    }

    const handleAddMember = () => {
        setDialogMode('add');
        setSelectedMember(null);
        setOpenDialog(true);
    };

    const handleEditMember = (memberId: number) => {
        setDialogMode('edit');
        
        const member = members.find((m) => m.id === memberId);
        
        if (member) {
            // Set the selected member with proper data structure
            setSelectedMember({
                id: member.id,
                name: member.user.name,
                email: member.user.email,
                studentId: member.user.studentId,
                phoneNumber: member.user.phoneNumber,
                role: member.roleInClub, // Map to the role values used in the dropdown
                status: member.status ? 'active' : 'inactive' // Convert boolean to string values used in dropdown
            });
            
            setOpenDialog(true);
        } else {
            toast.error('Không tìm thấy thông tin thành viên');
        }
    };

    const handleDeleteMember = (memberId: number) => {
        Swal.fire({
            title: 'Xác nhận xóa thành viên?',
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
                    await deleteUserFromClub(memberId);
                    await fetchMembers(parseInt(clubId));
                    toast.success('Đã xóa thành viên');
                } catch (error) {
                    console.error('Error deleting activity:', error);
                    toast.error('Đã có lỗi xảy ra khi xóa thành viên');
                }
            }
        });
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'leader':
                return colors.status.success;
            case 'charge':
                return colors.status.warning;
            default:
                return colors.status.info;
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'leader':
                return 'Trưởng CLB';
            case 'charge':
                return 'Phụ trách';
            default:
                return 'Thành viên';
        }
    };

    // Thêm phương thức để cập nhật form khi chọn thành viên
    useEffect(() => {
        if (selectedMember) {
            setRole(selectedMember.role || 'member');
            setStatus(selectedMember.status || 'active');
        } else {
            setRole('member');
            setStatus('active');
        }
    }, [selectedMember]);

    useEffect(() => {
        fetchMembers(parseInt(clubId));
    }, [clubId]);

    // Thêm phương thức xử lý khi lưu thay đổi
    const handleSaveMember = async () => {
        try {
            setLoading(true);
            
            if (dialogMode === 'edit' && selectedMember) {
                // Gọi API cập nhật thành viên
                await updateMemberShip(selectedMember.id, role, status === 'active');
                
                toast.success('Cập nhật thông tin thành viên thành công');
            } else if (dialogMode === 'add') {
                // Gọi API thêm thành viên
                const res = await addMemberToClub(parseInt(clubId), username);
                
                toast.success(res.data.message);
            }
            
            // Làm mới danh sách thành viên
            await fetchMembers(parseInt(clubId));
            setOpenDialog(false);
        } catch (error) {
            console.error('Error saving member:', error);
            toast.error('Đã có lỗi xảy ra khi lưu thông tin thành viên');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Quản lý thành viên</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddMember}
                    sx={{
                        borderRadius: 2,
                        background: colors.primary.gradient
                    }}
                >
                    Thêm thành viên
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: colors.shadow.card }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Họ và tên</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Vai trò</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>{member.user.name}</TableCell>
                                <TableCell>{member.user.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getRoleLabel(member.roleInClub)}
                                        sx={{
                                            backgroundColor: getRoleColor(member.roleInClub) + '20',
                                            color: getRoleColor(member.roleInClub),
                                            fontWeight: 500
                                        }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{member.user.phoneNumber}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={member.status === true ? 'Đang hoạt động' : 'Không hoạt động'}
                                        color={member.status === false ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => window.location.href = `mailto:${member.email}`}
                                    >
                                        <Email />
                                    </IconButton>
                                    <IconButton
                                        color="info"
                                        size="small"
                                        onClick={() => handleEditMember(member.id)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteMember(member.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

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
                    {dialogMode === 'add' ? 'Thêm thành viên mới' : 'Chỉnh sửa thông tin thành viên'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        {
                            dialogMode === 'add' && (
                                <TextField
                                    label="Tài khoản"
                                    fullWidth
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            )
                        }
                        <TextField
                            select
                            label="Vai trò"
                            fullWidth
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="member">Thành viên</MenuItem>
                            <MenuItem value="leader">Trưởng CLB</MenuItem>
                            <MenuItem value="charge">Phụ trách</MenuItem>
                        </TextField>
                        <TextField
                            select
                            label="Trạng thái"
                            fullWidth
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <MenuItem value="active">Đang hoạt động</MenuItem>
                            <MenuItem value="inactive">Không hoạt động</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveMember}
                        sx={{ background: colors.primary.gradient }}
                        disabled={loading}
                    >
                        {dialogMode === 'add' ? 'Thêm' : 'Lưu thay đổi'}
                    </Button>
                </DialogActions>
            </Dialog>
            <ToastContainer />
        </Box>
    );
}
