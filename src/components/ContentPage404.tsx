import React from 'react';
import Grid2 from "@mui/material/Unstable_Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from '@mui/material/Link'
import {Link as NavLink} from 'react-router-dom'
import Container from "@mui/material/Container";


const Content404Component = ({children}: { children: React.ReactNode }) => (
    <Grid2 xs={12} sm={6}
           sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
        {children}
    </Grid2>
);
const ContentPage404 = () => {

    return (
        <Container maxWidth="md">
            <Grid2 container>
                <Content404Component>
                    <Typography variant="body1" sx={{fontSize: '2rem', textAlign: 'center', mb: 2}}>
                        It looks like the page you were looking for can&#39;t be found.
                    </Typography>
                    <Typography variant="body2">
                        If you&#39;re looking for a product, browse our <Link component={NavLink} to="/products/all">products
                        listing</Link>.
                    </Typography>
                </Content404Component>
                <Content404Component>
                    <Box component="img"
                         src="/images/chums/404-Booby.gif"
                         sx={{maxWidth: "100%", height: "auto", maxHeight: '50vh'}}
                         alt="Page not found"/>
                </Content404Component>
            </Grid2>
        </Container>
    )
}

export default ContentPage404;
