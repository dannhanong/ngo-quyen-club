import React, { useState } from 'react';
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
    Chip,
    Grid
} from '@mui/material';
import { Add, Edit, Delete, Visibility, Image } from '@mui/icons-material';
import { colors } from '../../theme/colors';

interface Post {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    status: 'draft' | 'pending' | 'published' | 'rejected';
    author: string;
    category: string;
    thumbnail?: string;
    views: number;
}

interface ClubPostManagementProps {
    clubId: string;
}

export default function ClubPostManagement({ clubId }: ClubPostManagementProps) {
    const [ openDialog, setOpenDialog ] = useState(false);
    const [ dialogMode, setDialogMode ] = useState<'add' | 'edit'>('add');
    const [ selectedPost, setSelectedPost ] = useState<Post | null>(null);

    // Mock data
    const posts: Post[] = [
        {
            id: '1',
            title: 'Triển lãm Nghệ thuật Xuân 2024',
            content: 'Chi tiết về triển lãm nghệ thuật...',
            createdAt: '2023-12-15',
            status: 'published',
            author: 'Nguyễn Văn A',
            category: 'Sự kiện',
            views: 156
        },
        {
            id: '2',
            title: 'Tuyển thành viên mới 2024',
            content: 'Thông tin tuyển thành viên...',
            createdAt: '2023-12-10',
            status: 'pending',
            author: 'Trần Thị B',
            category: 'Thông báo',
            views: 89
        },
    ];

    const getStatusColor = (status: Post[ 'status' ]) => {
        switch (status) {
            case 'published':
                return colors.status.success;
            case 'pending':
                return colors.status.warning;
            case 'draft':
                return colors.status.info;
            case 'rejected':
                return colors.status.error;
            default:
                return colors.status.info;
        }
    };

    const getStatusLabel = (status: Post[ 'status' ]) => {
        switch (status) {
            case 'published':
                return 'Đã đăng';
            case 'pending':
                return 'Chờ duyệt';
            case 'draft':
                return 'Bản nháp';
            case 'rejected':
                return 'Từ chối';
            default:
                return 'Không xác định';
        }
    };

    const handleAddPost = () => {
        setDialogMode('add');
        setSelectedPost(null);
        setOpenDialog(true);
    };

    const handleEditPost = (post: Post) => {
        setDialogMode('edit');
        setSelectedPost(post);
        setOpenDialog(true);
    };

    const handleDeletePost = (postId: string) => {
        // Implement delete logic
        console.log('Delete post:', postId);
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Quản lý bài đăng</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddPost}
                    sx={{ borderRadius: 2, background: colors.primary.gradient }}
                >
                    Tạo bài đăng
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: colors.shadow.card }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tiêu đề</TableCell>
                            <TableCell>Người đăng</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell>Lượt xem</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {posts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>{post.title}</TableCell>
                                <TableCell>{post.author}</TableCell>
                                <TableCell>{post.createdAt}</TableCell>
                                <TableCell>{post.category}</TableCell>
                                <TableCell>{post.views}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusLabel(post.status)}
                                        sx={{
                                            backgroundColor: getStatusColor(post.status) + '20',
                                            color: getStatusColor(post.status),
                                            fontWeight: 500
                                        }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => console.log('View post')}
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        color="info"
                                        size="small"
                                        onClick={() => handleEditPost(post)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeletePost(post.id)}
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
                    {dialogMode === 'add' ? 'Tạo bài đăng mới' : 'Chỉnh sửa bài đăng'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Tiêu đề"
                            fullWidth
                            defaultValue={selectedPost?.title}
                        />
                        <TextField
                            label="Nội dung"
                            fullWidth
                            multiline
                            rows={6}
                            defaultValue={selectedPost?.content}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    label="Danh mục"
                                    fullWidth
                                    defaultValue={selectedPost?.category || 'event'}
                                >
                                    <MenuItem value="event">Sự kiện</MenuItem>
                                    <MenuItem value="news">Tin tức</MenuItem>
                                    <MenuItem value="announcement">Thông báo</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    label="Trạng thái"
                                    fullWidth
                                    defaultValue={selectedPost?.status || 'draft'}
                                >
                                    <MenuItem value="draft">Bản nháp</MenuItem>
                                    <MenuItem value="pending">Gửi duyệt</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Button
                            variant="outlined"
                            startIcon={<Image />}
                            sx={{ alignSelf: 'flex-start' }}
                        >
                            Thêm ảnh bìa
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={() => setOpenDialog(false)}
                        sx={{ background: colors.primary.gradient }}
                    >
                        {dialogMode === 'add' ? 'Đăng bài' : 'Lưu thay đổi'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
