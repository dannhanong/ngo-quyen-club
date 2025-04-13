import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Grid, Box, Avatar, IconButton, Typography,
    CircularProgress
} from '@mui/material';
import { PhotoCamera, Save } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { getProfile, updateProfile } from '../../services/authService';
import { toast } from 'react-toastify';

interface EditProfileDialogProps {
    open: boolean;
    onClose: () => void;
    userData: any;
}

export const EditProfileDialog = ({ open, onClose, userData }: EditProfileDialogProps) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    // Cập nhật form khi userData thay đổi
    useEffect(() => {
        if (userData) {
            setName(userData.name || '');
            setPhoneNumber(userData.phoneNumber || '');
            
            // Nếu có avatarCode, hiển thị avatar từ API
            if (userData.avatarCode) {
                setAvatarPreview(`${process.env.REACT_APP_BASE_URL}/files/preview/${userData.avatarCode}`);
            } else {
                setAvatarPreview(null);
            }
        }
    }, [userData, open]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            
            // Tạo preview cho file đã chọn
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            
            // Tạo đối tượng dữ liệu để gửi đi
            const updateData = {
                name: name,
                phoneNumber: phoneNumber,
                avatar: avatarFile // File avatar mới nếu có
            };
            
            // Gọi API cập nhật thông tin
            await updateProfile(updateData);
            
            // Hiển thị thông báo thành công
            toast.success("Cập nhật thông tin thành công");
            
            // Đóng dialog
            onClose();
            
            // Tùy chọn: làm mới dữ liệu người dùng trên trang chính
            window.location.reload();
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Đã xảy ra lỗi khi cập nhật thông tin");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                component: motion.div,
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                sx: {
                    borderRadius: 3,
                    overflow: 'hidden',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                }
            }}
        >
            <DialogTitle>
                Chỉnh sửa hồ sơ
            </DialogTitle>
            <DialogContent>
                <Box sx={{ my: 2, textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <Avatar
                            src={avatarPreview || '/static/images/default-avatar.png'}
                            sx={{
                                width: 120,
                                height: 120,
                                border: '4px solid white',
                                boxShadow: '0 0 20px rgba(0,0,0,0.1)'
                            }}
                        />
                        <IconButton
                            sx={{
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                                backgroundColor: 'primary.main',
                                color: 'white',
                                '&:hover': { backgroundColor: 'primary.dark' }
                            }}
                            component="label"
                        >
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={handleFileChange}
                            />
                            <PhotoCamera fontSize="small" />
                        </IconButton>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Nhấp vào biểu tượng máy ảnh để thay đổi ảnh đại diện
                    </Typography>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Họ và tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Số điện thoại"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} disabled={submitting}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <Save />}
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};