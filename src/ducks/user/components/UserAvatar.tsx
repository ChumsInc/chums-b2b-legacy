import React from 'react';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Avatar from "@mui/material/Avatar";
import {useSelector} from "react-redux";
import {selectLoggedIn, selectUserProfile, selectProfilePicture} from "@/ducks/user/selectors";
import Box,{BoxProps} from "@mui/material/Box";



function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name: string) {
    const initials = name.split(' ')
        .filter(name => name.length > 1)
        .filter((name, index) => index < 2)
        .map(name => name[0]).join('')
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${initials}`,
    };
}

const UserAvatar = (props:BoxProps) => {
    const isLoggedIn = useSelector(selectLoggedIn);
    const profile = useSelector(selectUserProfile);
    const profilePic = useSelector(selectProfilePicture);

    return (
        <Box {...props}>
            {(!isLoggedIn || !profile) && (
                <Avatar>
                    <AccountCircleIcon />
                </Avatar>
            )}
            {isLoggedIn && profile && profilePic && (
                <Avatar alt={profile.name} src={profilePic} />
            )}
            {isLoggedIn && profile && !profilePic && (
                <Avatar {...stringAvatar(profile.name)} />
            )}
        </Box>
    )
}

export default UserAvatar;
