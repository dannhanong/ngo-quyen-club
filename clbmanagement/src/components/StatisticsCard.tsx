import React from 'react';
import { Card, CardContent, Typography, Box, keyframes } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import { colors } from '../theme/colors';

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 10px rgba(255,255,255,0.2); }
  50% { box-shadow: 0 0 20px rgba(255,255,255,0.4); }
  100% { box-shadow: 0 0 10px rgba(255,255,255,0.2); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

interface StatisticsCardProps {
    title: string;
    value: number | string;
    icon: SvgIconComponent;
    color: string;
}

const StatisticsCard: React.FC<StatisticsCardProps> = ({ title, value, icon: Icon, color }) => {
    return (
        <Card sx={{
            height: '100%',
            background: `linear-gradient(135deg, ${color}, ${color}99)`,
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: colors.shadow.hover,
                '& .icon': {
                    transform: 'scale(1.2) rotate(10deg)',
                }
            },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 100%)',
                zIndex: 1
            }
        }}>
            <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography
                            variant="subtitle2"
                            sx={{
                                color: 'rgba(255,255,255,0.9)',
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                mb: 1
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                color: '#fff',
                                fontWeight: 800,
                                textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                            }}
                        >
                            {value}
                        </Typography>
                    </Box>
                    <Icon className="icon" sx={{
                        fontSize: 48,
                        color: 'rgba(255,255,255,0.9)',
                        transition: 'all 0.3s ease'
                    }} />
                </Box>
            </CardContent>
        </Card>
    );
};

export default StatisticsCard;
