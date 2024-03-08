import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const UsagePolicy = () => {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography gutterBottom variant="h3" component="h3">Usage Policy</Typography>
                <Typography variant="body1" sx={{fontSize: 'small'}}>
                    <p>
                        This system is for the use of authorized users only. Individuals using this computer system
                        without
                        authority, or in excess of their authority, are subject to having all of their activities on
                        this
                        system monitored and recorded by system personnel.
                    </p>
                    <p>
                        In the course of monitoring individuals improperly using this system, or in the course of system
                        maintenance, the activities of authorized users may also be monitored.
                    </p>
                    <p>
                        Anyone using this system expressly consents to such monitoring and is advised that if such
                        monitoring reveals possible evidence of criminal activity, system personnel may provide the
                        evidence
                        of such monitoring to law enforcement officials.
                    </p>
                </Typography>
            </CardContent>
        </Card>
    )
};

export default UsagePolicy;
