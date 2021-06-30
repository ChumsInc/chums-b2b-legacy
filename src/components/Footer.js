import React from 'react';
import AppVersion from "../common-components/AppVersion";

const Footer = () => {
    const date = new Date();
    return (

        <footer className="site-footer">
            <div className="contact-container">
                <div className="contact-address">
                    <div><strong>CONTACT US</strong></div>
                    <div>
                        <address>
                            <div>2424 SOUTH 2570 WEST</div>
                            <div>SALT LAKE CITY, UT 84119</div>
                            <div>(800) 222-2486</div>
                        </address>
                    </div>
                </div>
                <div className="social-icons">
                    <div className="icon">
                        <a href="http://www.twitter.com/ChumsUSA" target="_blank" className="twitter-icon" rel="noreferrer">
                            <span className="visually-hidden">Follow @ChumsUSA on Twitter</span>
                        </a>
                    </div>
                    <div className="icon">
                        <a href="https://www.facebook.com/Chumsusa" target="_blank" className="facebook-icon" rel="noreferrer">
                            <span className="visually-hidden">Like Chums on Facebook</span>
                        </a>
                    </div>
                    <div className="icon">
                        <a href="http://instagram.com/chumsusa" target="_blank" className="instagram-icon" rel="noreferrer">
                            <span className="visually-hidden">Like Chums on Instagram</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="bottom-links-container">
                <div className="ml-1"><AppVersion /></div>
                <div className="bottom-links">
                    <a href="//www.chums.com/page/jobs" target="_blank" rel="noreferrer">CAREERS</a>
                    <a href="//www.chums.com/page/customization" target="_blank" rel="noreferrer">CUSTOMIZE</a>
                    <a href="//www.chums.com/page/contact-us" target="_blank" rel="noreferrer">CONTACT</a>
                    <a href="//www.chums.com/page/returns-policy" target="_blank" rel="noreferrer">Returns</a>
                    <a href="//www.chums.com/page/shipping-policy" target="_blank" rel="noreferrer">Shipping</a>
                    <a href="//www.chums.com/page/social-compliance-policy" target="_blank" rel="noreferrer">Social Compliance Policy</a>
                    <a href="//www.chums.com/page/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>
                    <a href="https://www.chums.com" target="_blank" rel="noreferrer">CHUMS.COM</a>
                    <a href="https://www.chumssafety.com" target="_blank" rel="noreferrer">CHUMS SAFETY</a>
                </div>
                <div className="copyright">
                    © {date.getFullYear()} Chums. All rights reserved
                </div>
            </div>

        </footer>
    )
};

export default Footer;
