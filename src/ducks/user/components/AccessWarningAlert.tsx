import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import React from "react";
import Divider from "@mui/material/Divider";

const AccessWarningAlert = () => {
    return (
        <Alert severity="error" title="WARNING:" sx={{my: 3, p: 5}}>
            <Typography sx={{fontWeight: 'bold', marginRight: 1, mb: 1}}>WARNING</Typography>
            <Divider />
            <Typography>
                Unauthorized access to this system is forbidden and will be prosecuted
                by law. By accessing this system, you agree that your actions may be monitored if unauthorized
                usage is suspected.
            </Typography>
        </Alert>
    )
}

export default AccessWarningAlert;
