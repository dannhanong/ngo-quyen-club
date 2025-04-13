import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Typography,
    IconButton,
    Box,
    Chip,
    Divider
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface Member {
    id: number;
    name: string;
    role: string;
    avatar: string;
    joinDate: string;
    status: 'active' | 'inactive';
}

interface ClubMembersListProps {
    open: boolean;
    onClose: () => void;
    clubName: string;
    members: Member[];
}

export const ClubMembersList = ({ open, onClose, clubName, members }: ClubMembersListProps) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                }
            }}
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        Thành viên {clubName}
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <List>
                    <AnimatePresence>
                        {members.map((member, index) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ListItem
                                    sx={{
                                        mb: 1,
                                        borderRadius: 2,
                                        '&:hover': {
                                            backgroundColor: 'rgba(0,0,0,0.02)',
                                        }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar
                                            src={member.avatar}
                                            sx={{ width: 50, height: 50 }}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {member.name}
                                                <Chip
                                                    label={member.role}
                                                    size="small"
                                                    color={member.role === 'Trưởng CLB' ? 'primary' : 'default'}
                                                />
                                            </Box>
                                        }
                                        secondary={`Tham gia: ${member.joinDate}`}
                                        sx={{ ml: 2 }}
                                    />
                                    <Chip
                                        label={member.status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
                                        color={member.status === 'active' ? 'success' : 'default'}
                                        size="small"
                                    />
                                </ListItem>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </List>
            </DialogContent>
        </Dialog>
    );
};
