import React from 'react';
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
} from '@mui/material';

export const ClubForm: React.FC = () => {
    return (
        <Box sx={{ p: 2 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Tên câu lạc bộ"
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Trưởng câu lạc bộ"
                        required
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                        <InputLabel>Danh mục</InputLabel>
                        <Select label="Danh mục">
                            <MenuItem value="art">Nghệ thuật</MenuItem>
                            <MenuItem value="sport">Thể thao</MenuItem>
                            <MenuItem value="science">Khoa học</MenuItem>
                            <MenuItem value="language">Ngoại ngữ</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Mô tả"
                        multiline
                        rows={4}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Thời gian sinh hoạt"
                        placeholder="VD: Thứ 2, Thứ 4"
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Địa điểm"
                        placeholder="VD: Phòng A101"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
