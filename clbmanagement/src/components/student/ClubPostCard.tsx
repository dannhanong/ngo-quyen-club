import React from 'react';
import { Card, CardContent, CardHeader, Typography, Avatar, Box, IconButton } from '@mui/material';
import { MoreVert, Favorite, Comment } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ClubPostCardProps {
    post: {
        id: number;
        clubName: string;
        author: string;
        date: string;
        content: string;
        likes: number;
        comments: number;
        clubAvatar: string;
    };
}

export const ClubPostCard = ({ post }: ClubPostCardProps) => {
    return (
        <Card
            component={motion.div}
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            sx={{
                mb: 2,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
                '& .MuiIconButton-root': {
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.1)',
                    }
                }
            }}
        >
            <CardHeader
                avatar={
                    <Avatar src={post.clubAvatar} alt={post.clubName}>
                        {post.clubName[ 0 ]}
                    </Avatar>
                }
                action={
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                }
                title={post.clubName}
                subheader={`${post.author} • ${post.date}`}
            />
            <CardContent>
                <Typography variant="body1" paragraph>
                    {post.content}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small" color="primary">
                                <Favorite />
                            </IconButton>
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                                {post.likes}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton size="small">
                                <Comment />
                            </IconButton>
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                                {post.comments}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
