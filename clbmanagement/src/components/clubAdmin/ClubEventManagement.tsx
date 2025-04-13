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
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';
import { colors } from '../../theme/colors';
import { Activity } from '../../models/Activity';
import { getActivitiesInClub, createActivity, updateActivity, deleteActivity } from '../../services/activityService';
import { ActivityRequest } from '../../models/ActivityRequest';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';

interface Event {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    maxParticipants: number;
    currentParticipants: number;
}

interface ClubEventManagementProps {
    clubId: string;
}

export default function ClubEventManagement({ clubId }: ClubEventManagementProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
    const [selectedEvent, setSelectedEvent] = useState<ActivityRequest | null>(null);
    const [events, setEvents] = useState<Activity[]>([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startTime, setStartTime] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

    const getStatusLabelByTime = (startTime: Date | null) => {
        if (!startTime) return 'Sắp diễn ra';

        const now = new Date();
        const oneHourAfter = new Date(startTime);
        oneHourAfter.setHours(oneHourAfter.getHours() + 2); // Giả sử sự kiện kéo dài 2 giờ

        if (startTime > now) {
            return 'Sắp diễn ra';
        } else if (now >= startTime && now <= oneHourAfter) {
            return 'Đang diễn ra';
        } else {
            return 'Đã kết thúc';
        }
    };

    const getStatusColorByTime = (startTime: Date | null) => {
        if (!startTime) return colors.status.info;

        const now = new Date();
        const oneHourAfter = new Date(startTime);
        oneHourAfter.setHours(oneHourAfter.getHours() + 2); // Giả sử sự kiện kéo dài 2 giờ

        if (startTime > now) {
            return colors.status.info;
        } else if (now >= startTime && now <= oneHourAfter) {
            return colors.status.success;
        } else {
            return colors.status.warning;
        }
    };

    // Update the fetchAllActivities function to use the clubId prop
    const fetchAllActivities = async () => {
        if (!clubId) return; // Don't fetch if no club is selected

        try {
            const response = await getActivitiesInClub(parseInt(clubId));
            setEvents(response.data.content);
        } catch (error) {
            console.error("Error fetching activities:", error);
            // You might want to add error handling UI here
        }
    }

    // Update the useEffect to re-fetch when clubId changes
    useEffect(() => {
        if (clubId) {
            fetchAllActivities();
        }
    }, [clubId]);

    const getStatusColor = (status: Event['status']) => {
        switch (status) {
            case 'upcoming':
                return colors.status.info;
            case 'ongoing':
                return colors.status.success;
            case 'completed':
                return colors.status.warning;
            case 'cancelled':
                return colors.status.error;
            default:
                return '#000000'; // or any other default color
        }
    };

    const getStatusLabel = (status: Event['status']) => {
        switch (status) {
            case 'upcoming':
                return 'Sắp diễn ra';
            case 'ongoing':
                return 'Đang diễn ra';
            case 'completed':
                return 'Đã kết thúc';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    const handleAddEvent = () => {
        setDialogMode('add');
        resetForm();
        setSelectedEvent(null);
        setOpenDialog(true);
    };

    const handleEditEvent = (event: Activity) => {
        setDialogMode('edit');
        setTitle(event.title);
        setDescription(event.description || '');
        
        // Format date for datetime-local input
        const eventDate = new Date(event.startTime);
        const formattedDate = eventDate.toISOString().slice(0, 16);
        setStartTime(formattedDate);
        
        setLocation(event.location);
        // Handle image if needed
        setSelectedEvent({
            clubId: parseInt(clubId),
            title: event.title,
            description: event.description,
            startTime: event.startTime,
            location: event.location,
            image: null // or handle image if needed
        });
        setSelectedEventId(event.id);
        setOpenDialog(true);
    };

    const handleDeleteEvent = async (eventId: number) => {
        Swal.fire({
            title: 'Xác nhận xóa hoạt động?',
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
                    await deleteActivity(eventId);
                    await fetchAllActivities();
                    toast.success('Đã xóa hoạt động');
                } catch (error) {
                    console.error('Error deleting activity:', error);
                    toast.error('Đã có lỗi xảy ra khi xóa hoạt động');
                }
            }
        });
    };

    const handleSubmit = async () => {
        if (!title || !startTime || !location) {
            // You should add proper validation feedback to the user
            alert('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }
        
        setLoading(true);
        
        try {
            const activityData: ActivityRequest = {
                clubId: parseInt(clubId),
                title,
                description,
                startTime: new Date(startTime),
                location,
                image
            };
            
            if (dialogMode === 'add') {
                await createActivity(activityData);
            } else if (dialogMode === 'edit' && selectedEvent) {
                await updateActivity(activityData, selectedEventId);
            }
            
            // Refresh the activities list
            await fetchAllActivities();
            
            // Close dialog and reset form
            setOpenDialog(false);
            resetForm();
        } catch (error) {
            console.error('Error saving activity:', error);
            alert('Đã có lỗi xảy ra khi lưu hoạt động');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setStartTime('');
        setLocation('');
        setImage(null);
    };

    return (
        <Box>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5">Quản lý hoạt động</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddEvent}
                    sx={{ borderRadius: 2, background: colors.primary.gradient }}
                >
                    Thêm hoạt động
                </Button>
            </Box>

            <TableContainer component={Paper} sx={{ boxShadow: colors.shadow.card }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên hoạt động</TableCell>
                            <TableCell>Thời gian</TableCell>
                            <TableCell>Địa điểm</TableCell>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.length > 0 ? events.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>{event.title}</TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="textSecondary">
                                        Bắt đầu: {new Date(event.startTime).toLocaleString('vi-VN')}
                                    </Typography>
                                </TableCell>
                                <TableCell>{event.location}</TableCell>
                                <TableCell>
                                    <img
                                        src={`${process.env.REACT_APP_BASE_URL}/files/preview/${event.imageCode}`}
                                        alt={event.title}
                                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusLabel(new Date(event.startTime) > new Date() ? 'upcoming' : 'completed')}
                                        sx={{
                                            backgroundColor: getStatusColor(new Date(event.startTime) > new Date() ? 'upcoming' : 'completed') + '20',
                                            color: getStatusColor(new Date(event.startTime) > new Date() ? 'upcoming' : 'completed'),
                                            fontWeight: 500
                                        }}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        color="primary"
                                        size="small"
                                        onClick={() => console.log('View details', event.id)}
                                    >
                                        <Visibility />
                                    </IconButton>
                                    <IconButton
                                        color="info"
                                        size="small"
                                        onClick={() => handleEditEvent(event)}
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteEvent(event.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Không có hoạt động nào</TableCell>
                            </TableRow>
                        )}
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
                    {dialogMode === 'add' ? 'Thêm hoạt động mới' : 'Chỉnh sửa thông tin hoạt động'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                        <TextField
                            label="Tên hoạt động"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <TextField
                            label="Mô tả"
                            fullWidth
                            multiline
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <TextField
                            label="Ngày bắt đầu"
                            type="datetime-local"
                            fullWidth
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="Địa điểm"
                            fullWidth
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
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
                            <Typography variant="body2">Ảnh bìa hoạt động</Typography>
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
                        <Box sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2
                        }}>
                            <Typography variant="body2">Trạng thái hoạt động: </Typography>
                            <Chip
                                label={getStatusLabelByTime(
                                    dialogMode === 'edit' && selectedEvent ? new Date(selectedEvent.startTime) : null
                                )}
                                sx={{
                                    backgroundColor: getStatusColorByTime(
                                        dialogMode === 'edit' && selectedEvent ? new Date(selectedEvent.startTime) : null
                                    ) + '20',
                                    color: getStatusColorByTime(
                                        dialogMode === 'edit' && selectedEvent ? new Date(selectedEvent.startTime) : null
                                    ),
                                    fontWeight: 500
                                }}
                                size="small"
                            />
                            <Typography variant="caption" color="text.secondary">
                                (Trạng thái được tính tự động dựa trên thời gian bắt đầu)
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
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
