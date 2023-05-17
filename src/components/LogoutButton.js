import React from 'react';

const LogoutButton = ({onLogout}) => {
    return (
        <button type="button" className="btn btn-sm btn-outline-secondary me-1 mb-1" onClick={onLogout}>
            Logout
        </button>
    )
};

export default LogoutButton;
