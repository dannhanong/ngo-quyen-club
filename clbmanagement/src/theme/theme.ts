import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#2962ff',
            light: '#768fff',
            dark: '#0039cb',
        },
        secondary: {
            main: '#7b1fa2',
            light: '#ae52d4',
            dark: '#4a0072',
        },
        background: {
            default: '#f8faff',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        h4: {
            fontWeight: 700,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
    },
    shadows: [
        'none',
        '0px 2px 4px rgba(41, 98, 255, 0.1)',
        '0px 4px 8px rgba(41, 98, 255, 0.15)',
        '0px 8px 16px rgba(41, 98, 255, 0.2)',
        '0px 16px 24px rgba(41, 98, 255, 0.25)',
        '0px 24px 32px rgba(41, 98, 255, 0.3)',
        '0px 32px 40px rgba(41, 98, 255, 0.35)',
        '0px 40px 48px rgba(41, 98, 255, 0.4)',
        '0px 48px 56px rgba(41, 98, 255, 0.45)',
        '0px 56px 64px rgba(41, 98, 255, 0.5)',
        '0px 64px 72px rgba(41, 98, 255, 0.55)',
        '0px 72px 80px rgba(41, 98, 255, 0.6)',
        '0px 80px 88px rgba(41, 98, 255, 0.65)',
        '0px 88px 96px rgba(41, 98, 255, 0.7)',
        '0px 96px 104px rgba(41, 98, 255, 0.75)',
        '0px 104px 112px rgba(41, 98, 255, 0.8)',
        '0px 112px 120px rgba(41, 98, 255, 0.85)',
        '0px 120px 128px rgba(41, 98, 255, 0.9)',
        '0px 128px 136px rgba(41, 98, 255, 0.95)',
        '0px 136px 144px rgba(41, 98, 255, 1)',
        '0px 144px 152px rgba(41, 98, 255, 1.05)',
        '0px 152px 160px rgba(41, 98, 255, 1.1)',
        '0px 160px 168px rgba(41, 98, 255, 1.15)',
        '0px 168px 176px rgba(41, 98, 255, 1.2)',
        '0px 176px 184px rgba(41, 98, 255, 1.25)',
    ],
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#ffffff',
                    color: '#111827',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.6))',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: 16,
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
                },
            },
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    marginBottom: 4,
                },
            },
        },
    },
    shape: {
        borderRadius: 16,
    },
});
