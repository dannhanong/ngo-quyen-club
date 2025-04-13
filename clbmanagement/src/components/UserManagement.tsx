import React, { useState, useEffect } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Pagination,
    Stack,
    Card,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    MenuItem
} from '@mui/material';
import { Edit, Delete, Search, Block } from '@mui/icons-material';
import { keyframes } from '@emotion/react';
import { colors } from '../theme/colors';
import axiosInstance from '../api/axiosConfig';
import { User, UsersResponse } from '../types/user';
import LoadingSpinner from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { alpha } from '@mui/material/styles';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const UserManagement = () => {
    const [ users, setUsers ] = useState<User[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ error, setError ] = useState<string | null>(null);
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ pageSize ] = useState(5);
    const [ editDialogOpen, setEditDialogOpen ] = useState(false);
    const [ selectedUser, setSelectedUser ] = useState<User | null>(null);
    const [ editFormData, setEditFormData ] = useState({
        name: '',
        email: '',
        username: '',
        roles: '',
        enabled: true
    });

    useEffect(() => {
        fetchUsers();
    }, []); // Remove page dependency since we're doing client-side pagination

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get<UsersResponse>(
                `/auth/admin/get-all-users`
            );
            setUsers(response.data.content);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort users based on search term and ID
    const filteredUsers = users
        .filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            // Sort IDs in ascending order
            return a.id - b.id;
        });

    // Calculate pagination values
    const indexOfLastUser = currentPage * pageSize;
    const indexOfFirstUser = indexOfLastUser - pageSize;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / pageSize);

    const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setEditFormData({
            name: user.name,
            email: user.email,
            username: user.username,
            roles: user.roles,
            enabled: user.enabled
        });
        setEditDialogOpen(true);
    };

    const handleUpdateUser = async () => {
        if (!selectedUser) return;

        try {
            await axiosInstance.put(
                `auth/admin/update-account/${selectedUser.id}`,
                editFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            // Refresh user list after successful update
            fetchUsers();
            setEditDialogOpen(false);
            // You might want to add a success notification here
        } catch (error) {
            console.error('Error updating user:', error);
            // You might want to add an error notification here
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [ name ]: value
        }));
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <Box sx={{ color: 'error.main', p: 2 }}>{error}</Box>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Stack spacing={4}>
                {/* Enhanced Header Section */}
                <Card
                    sx={{
                        p: 3,
                        background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
                        borderRadius: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            width: '200%',
                            height: '200%',
                            background: `radial-gradient(circle, ${alpha(colors.background.paper, 0.1)} 0%, transparent 50%)`,
                            top: '-50%',
                            left: '-50%',
                            animation: 'rotate 15s linear infinite',
                        },
                        '@keyframes rotate': {
                            '0%': { transform: 'rotate(0deg)' },
                            '100%': { transform: 'rotate(360deg)' },
                        }
                    }}
                >
                    <Stack
                        direction={{ xs: 'column', md: 'row' }}
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={3}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: 'white',
                                    fontWeight: 700,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    mb: 1
                                }}
                            >
                                Quản lý người dùng
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    color: alpha('#fff', 0.8),
                                    maxWidth: 500
                                }}
                            >
                                Quản lý tất cả tài khoản người dùng trong hệ thống
                            </Typography>
                        </Box>
                        <TextField
                            size="medium"
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{
                                minWidth: 300,
                                '& .MuiOutlinedInput-root': {
                                    background: alpha(colors.background.paper, 0.1),
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${alpha('#fff', 0.2)}`,
                                    color: 'white',
                                    transition: 'all 0.3s ease',
                                    '& fieldset': { border: 'none' },
                                    '&:hover': {
                                        background: alpha(colors.background.paper, 0.15),
                                    },
                                    '&.Mui-focused': {
                                        background: alpha(colors.background.paper, 0.2),
                                    }
                                },
                                '& .MuiInputBase-input::placeholder': {
                                    color: alpha('#fff', 0.7)
                                },
                                '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                                    color: alpha('#fff', 0.7)
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
                    </Stack>
                </Card>

                {/* Enhanced Table Section */}
                <Card
                    sx={{
                        background: alpha(colors.background.paper, 0.8),
                        backdropFilter: 'blur(20px)',
                        borderRadius: 4,
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                        border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
                    }}
                >
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow
                                    sx={{
                                        background: alpha(colors.background.darker, 0.5),
                                        backdropFilter: 'blur(20px)',
                                        '& th': {
                                            color: colors.text.primary,
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            py: 2,
                                            borderBottom: `2px solid ${colors.primary.main}`
                                        }
                                    }}
                                >
                                    <TableCell>ID</TableCell>  {/* Added ID column */}
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Username</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Vai trò</TableCell>
                                    <TableCell align="right">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <AnimatePresence>
                                    {currentUsers.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            style={{
                                                background: index % 2 === 0 ? 'transparent' : alpha(colors.background.darker, 0.3)
                                            }}
                                        >
                                            <TableCell>{user.id}</TableCell>  {/* Added ID cell */}
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.roles}
                                                    color={user.roles === 'admin' ? 'primary' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            color: colors.primary.main,
                                                            '&:hover': { background: colors.primary.main + '10' }
                                                        }}
                                                        onClick={() => handleEditClick(user)}
                                                    >
                                                        <Edit />
                                                    </IconButton>
                                                    {/* <IconButton
                                                        size="small"
                                                        sx={{
                                                            color: colors.status.error,
                                                            '&:hover': { background: colors.status.error + '10' }
                                                        }}
                                                    >
                                                        <Delete />
                                                    </IconButton> */}
                                                </Stack>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Enhanced Pagination */}
                    <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            px: 3,
                            py: 3,
                            background: alpha(colors.background.darker, 0.5),
                            backdropFilter: 'blur(20px)',
                            borderTop: `1px solid ${alpha(colors.primary.main, 0.1)}`
                        }}
                    >
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            size="small"
                            showFirstButton
                            showLastButton
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    background: alpha(colors.background.paper, 0.5),
                                    backdropFilter: 'blur(10px)',
                                    border: `1px solid ${alpha(colors.primary.main, 0.1)}`,
                                    color: colors.text.primary,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        background: alpha(colors.primary.main, 0.1),
                                        transform: 'translateY(-2px)'
                                    },
                                    '&.Mui-selected': {
                                        background: colors.primary.gradient,
                                        color: '#fff',
                                        boxShadow: `0 4px 12px ${alpha(colors.primary.main, 0.3)}`,
                                        '&:hover': {
                                            background: colors.primary.gradient,
                                        }
                                    }
                                }
                            }}
                        />
                    </Stack>
                </Card>

                {/* Enhanced Dialog */}
                <Dialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            background: `linear-gradient(135deg, ${alpha(colors.background.paper, 0.95)} 0%, ${alpha(colors.background.darker, 0.95)} 100%)`,
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.3)',
                            border: `1px solid ${alpha(colors.primary.main, 0.1)}`
                        }
                    }}
                >
                    <DialogTitle>
                        Chỉnh sửa thông tin người dùng
                    </DialogTitle>
                    <DialogContent>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <TextField
                                label="Tên"
                                name="name"
                                value={editFormData.name}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                label="Email"
                                name="email"
                                value={editFormData.email}
                                onChange={handleInputChange}
                                fullWidth
                                type="email"
                            />
                            <TextField
                                label="Username"
                                name="username"
                                value={editFormData.username}
                                onChange={handleInputChange}
                                fullWidth
                            />
                            <TextField
                                select
                                label="Vai trò"
                                name="roles"
                                value={editFormData.roles}
                                onChange={handleInputChange}
                                fullWidth
                            >
                                <MenuItem value="user">User</MenuItem>
                                <MenuItem value="user">Giáo viên</MenuItem>
                                <MenuItem value="admin">Admin</MenuItem>
                            </TextField>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialogOpen(false)}>
                            Hủy
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleUpdateUser}
                            sx={{ background: colors.primary.gradient }}
                        >
                            Lưu thay đổi
                        </Button>
                    </DialogActions>
                </Dialog>
            </Stack>
        </motion.div>
    );
};

export default UserManagement;
