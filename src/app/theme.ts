import {createTheme, responsiveFontSizes} from '@mui/material/styles'

declare module '@mui/material/styles' {
    interface TypographyVariants {
        variantButtonText: React.CSSProperties;
        variantButtonPrice: React.CSSProperties;
    }

    // allow configuration using `createTheme`
    interface TypographyVariantsOptions {
        variantButtonText?: React.CSSProperties;
        variantButtonPrice?: React.CSSProperties;
    }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
    interface TypographyPropsVariantOverrides {
        variantButtonText: true;
        variantButtonPrice: true;
    }
}

let theme = createTheme({});

theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    backgroundColor: '#FFFFFF',
                    backgroundSize: 'cover',
                    minHeight: '100%',
                    position: 'relative',
                },
                body: {
                    minHeight: '100vh',
                    '#app': {
                        boxSizing: 'border-box',
                        minHeight: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        header: {
                            flexGrow: 0,
                            flexShrink: 0,
                        },
                        main: {
                            flexGrow: 1,
                        },
                        footer: {
                            flexGrow: 0,
                            flexShrink: 0,
                        },
                    }
                }
            }
        }
    },
    typography: {
        fontFamily: [
            "Roboto Condensed",
            '-apple-system',
            'BlinkMacSystemFont',
            "Segoe UI",
            'Roboto',
            "Helvetica Neue",
            'Arial',
            'sans-serif',
            "Apple Color Emoji",
            "Segoe UI Emoji",
            "Segoe UI Symbol"
        ].join(','),
        fontSize: 14,
        h1: {
            textTransform: 'uppercase',
            fontWeight: 300,
            fontSize: 40
        },
        h2: {
            textTransform: 'uppercase',
            fontWeight: 600,
            fontSize: 36,
        },
        h3: {
            textTransform: 'uppercase',
            fontWeight: 600,
            fontSize: 32
        },
        h4: {
            textTransform: 'uppercase',
            fontWeight: 600,
            fontSize: 28
        },
        variantButtonText: {
            fontWeight: 500,
            fontSize: 16,
        },
        variantButtonPrice: {
            fontWeight: 300,
            fontSize: 14,
        }
    }
})


export default theme;
