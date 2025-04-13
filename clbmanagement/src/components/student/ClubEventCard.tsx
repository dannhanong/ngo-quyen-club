import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Chip, IconButton } from '@mui/material';
import { Event, Place, Group, InfoOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface ClubEventCardProps {
    event: {
        id: number;
        title: string;
        clubName: string;
        date: string;
        location: string;
        image: string;
        status: 'upcoming' | 'ongoing' | 'completed';
    };
    onViewDetails: (id: number) => void;
}

export const ClubEventCard = ({ event, onViewDetails }: ClubEventCardProps) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return '#2196f3';
            case 'ongoing': return '#4caf50';
            case 'completed': return '#9e9e9e';
            default: return '#9e9e9e';
        }
    };

    return (
        <Card
            component={motion.div}
            whileHover={{ y: -8, boxShadow: '0 12px 40px rgba(31, 38, 135, 0.2)' }}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                borderRadius: 3,
                overflow: 'hidden',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 140,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
                    zIndex: 1,
                    transition: 'opacity 0.3s ease',
                    opacity: 0,
                },
                '&:hover::before': {
                    opacity: 1,
                },
                '& .MuiCardMedia-root': {
                    transition: 'transform 0.3s ease',
                },
                '&:hover .MuiCardMedia-root': {
                    transform: 'scale(1.05)',
                }
            }}
        >
            <CardMedia
                component="img"
                height="140"
                image={event.image}
                alt={event.title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2 }}>
                    <Chip
                        size="small"
                        label={event.status}
                        sx={{
                            backgroundColor: getStatusColor(event.status),
                            color: 'white',
                            mb: 1
                        }}
                    />
                    <Typography variant="h6" gutterBottom>
                        {event.title}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                        {event.clubName}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Event sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{event.date}</Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Place sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{event.location}</Typography>
                </Box>
            </CardContent>

            <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                    size="small"
                    onClick={() => onViewDetails(event.id)}
                    sx={{ color: 'primary.main' }}
                >
                    <InfoOutlined />
                </IconButton>
            </Box>
        </Card>
    );
};
