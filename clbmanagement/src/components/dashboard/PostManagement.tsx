import React from 'react';
import {
    Box,
    Card,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Button,
    Stack,
    Menu,
    MenuItem,
    TextField,
    InputAdornment,
} from '@mui/material';
import {
    Visibility,
    Edit,
    Delete,
    FilterList,
    Search,
    MoreVert,
} from '@mui/icons-material';
import { colors } from '../../theme/colors';

const mockPosts = [
    {
        id: 1,
        title: "Tuyển thành viên CLB Mỹ Thuật",
        club: "CLB Mỹ Thuật",
        author: "Nguyễn Văn A",
        publishDate: "2024-01-15",
        status: "published",
        views: 245,
    },
    {
        id: 2,
        title: "Thông báo buổi diễn acoustic tháng 1",
        club: "CLB Âm nhạc",
        author: "Trần Thị B",
        publishDate: "2024-01-14",
        status: "pending",
        views: 0,
    },
    {
        id: 3,
        title: "Recap sự kiện giao lưu võ thuật",
        club: "CLB Võ Thuật",
        author: "Lê Văn C",
        publishDate: "2024-01-13",
        status: "published",
        views: 567,
    },
];

export const PostManagement = () => {
    const [ filterAnchor, setFilterAnchor ] = React.useState<null | HTMLElement>(null);

    return (
        <Box>
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <TextField
                    placeholder="Tìm kiếm bài đăng..."
                    size="small"
                    sx={{ flex: 1 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="outlined"
                    startIcon={<FilterList />}
                    onClick={(e) => setFilterAnchor(e.currentTarget)}
                >
                    Lọc
                </Button>
            </Stack>

            <Menu
                anchorEl={filterAnchor}
                open={Boolean(filterAnchor)}
                onClose={() => setFilterAnchor(null)}
            >
                <MenuItem>Tất cả bài đăng</MenuItem>
                <MenuItem>Đã xuất bản</MenuItem>
                <MenuItem>Đang chờ duyệt</MenuItem>
                <MenuItem>Đã từ chối</MenuItem>
            </Menu>

            <TableContainer component={Card} sx={{
                borderRadius: 3,
                background: colors.background.glassy,
                border: `1px solid ${colors.border.light}`,
            }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tiêu đề</TableCell>
                            <TableCell>CLB</TableCell>
                            <TableCell>Tác giả</TableCell>
                            <TableCell>Ngày đăng</TableCell>
                            <TableCell align="center">Lượt xem</TableCell>
                            <TableCell align="center">Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {mockPosts.map((post) => (
                            <TableRow key={post.id}>
                                <TableCell>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {post.title}
                                    </Typography>
                                </TableCell>
                                <TableCell>{post.club}</TableCell>
                                <TableCell>{post.author}</TableCell>
                                <TableCell>{post.publishDate}</TableCell>
                                <TableCell align="center">
                                    {post.views}
                                </TableCell>
                                <TableCell align="center">
                                    <Chip
                                        label={
                                            post.status === 'published' ? 'Đã xuất bản' :
                                                post.status === 'pending' ? 'Đang chờ duyệt' : 'Đã từ chối'
                                        }
                                        color={
                                            post.status === 'published' ? 'success' :
                                                post.status === 'pending' ? 'warning' : 'error'
                                        }
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton size="small" color="primary">
                                        <Visibility />
                                    </IconButton>
                                    <IconButton size="small" color="info">
                                        <Edit />
                                    </IconButton>
                                    <IconButton size="small" color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};
