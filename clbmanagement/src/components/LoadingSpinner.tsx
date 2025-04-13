import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { colors } from '../theme/colors';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Đang tải...' }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '200px',
                gap: 2,
            }}
        >
            <CircularProgress
                size={40}
                thickness={4}
                sx={{
                    color: colors.primary.main,
                }}
            />
            <Typography
                variant="body1"
                sx={{
                    color: colors.text.secondary,
                    fontWeight: 500,
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default LoadingSpinner;
