import React from 'react';
import { Card, Typography, Box, SvgIconProps, keyframes } from '@mui/material';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.02); }
  100% { transform: scale(1); }
`;

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactElement<SvgIconProps>;
    trend?: number;
    color?: string;
    onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, color = '#4f46e5', onClick }) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: `linear-gradient(135deg, ${color}10, ${color}05)`,
                backdropFilter: 'blur(8px)',
                position: 'relative',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: `${color}15`,
                cursor: onClick ? 'pointer' : 'default',
                '&:hover': {
                    transform: onClick ? 'translateY(-4px) scale(1.01)' : 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: `0 12px 30px -10px ${color}30`,
                    '& .icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                    },
                },
                '& .icon': {
                    transition: 'transform 0.3s ease',
                },
            }}
        >
            <Box>
                <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>{title}</Typography>
                <Typography variant="h4" sx={{ fontWeight: 600, color: color }}>
                    {value}
                    {trend && (
                        <Typography component="span" variant="caption"
                            sx={{
                                ml: 1,
                                color: trend > 0 ? 'success.main' : 'error.main',
                                fontSize: '0.75rem'
                            }}>
                            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                        </Typography>
                    )}
                </Typography>
            </Box>
            <Box className="icon" sx={{
                color: color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                p: 1,
                backgroundColor: `${color}15`,
            }}>
                {React.cloneElement(icon, { sx: { fontSize: 40 } })}
            </Box>
        </Card>
    );
};
