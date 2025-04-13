import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Grid,
    Chip,
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';

interface Post {
    id: number;
    clubName: string;
    title: string;
    status: string;
    date: string;
}

interface PostApprovalListProps {
    posts: Post[];
}

export const PostApprovalList: React.FC<PostApprovalListProps> = ({ posts }) => {
    return (
        <Grid container spacing={2}>
            {posts.map((post) => (
                <Grid item xs={12} key={post.id}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                    <Typography variant="h6">{post.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {post.clubName} • {post.date}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<Visibility />}
                                    >
                                        Xem
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        size="small"
                                        startIcon={<CheckCircle />}
                                    >
                                        Duyệt
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="small"
                                        startIcon={<Cancel />}
                                    >
                                        Từ chối
                                    </Button>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};
