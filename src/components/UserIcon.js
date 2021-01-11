import React from 'react';

const UserIcon = ({accountType}) => {
    switch (accountType) {
    case 1:
        return (<span className="material-icons material-icons-sm">person</span>);
    case 2:
        return (<span className="material-icons material-icons-sm">group</span>);
    case 4:
        return (<span className="material-icons material-icons-sm">store</span>);
    }
    return (<span className="material-icons material-icons-sm">error_outline</span>);
};

export default UserIcon;
