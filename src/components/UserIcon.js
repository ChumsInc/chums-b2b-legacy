import React from 'react';
import StoreIcon from '@mui/icons-material/Store';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/**
 *
 * @param {number} accountType
 * @return {JSX.Element}
 * @constructor
 */
const UserIcon = ({accountType}) => {
    switch (accountType) {
    case 1:
        return (<PersonIcon fontSize="small"/>);
    case 2:
        return (<GroupIcon fontSize="small" />);
    case 4:
        return (<StoreIcon fontSize="small" />);
    }
    return (<ErrorOutlineIcon fontSize="small" />);
};

export default UserIcon;
