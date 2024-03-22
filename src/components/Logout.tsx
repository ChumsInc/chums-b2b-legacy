import React, {useEffect} from 'react';
import UserProfile from "../ducks/user/components/UserProfile";
import {useAppDispatch} from "../app/configureStore";
import {logout} from "../ducks/user/actions";
import {useNavigate} from "react-router";

const Logout = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(logout())
            .then(() => {
                navigate('/login');
            })
    }, []);

    return (
        <div>Logging out.</div>
    );
}

export default Logout;
