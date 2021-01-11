import React from 'react';
import HangOnBar from './HangOnBar';
import NavBar from './NavBar';

const Header = () => {
    return (
        <header className="site-header">
            <HangOnBar/>
            <NavBar />
        </header>
    );
};

export default Header;
