import React from 'react';
import {Link} from 'react-router-dom';
import classNames from "classnames";
import {PATH_PROFILE_ACCOUNT} from "../constants/paths";
import {longRepNo} from "../utils/customer";

const RepLink = ({id, SalespersonDivisionNo = '', SalespersonNo = '', selected = false}) => {
    const path = PATH_PROFILE_ACCOUNT.replace(':id', encodeURIComponent(id));
    const btnClassName = {
        'btn-outline-secondary': !selected,
        'btn-secondary': selected
    };
    return (
        <Link to={path} className={classNames("btn btn-sm", btnClassName)}>
            {longRepNo({SalespersonDivisionNo, SalespersonNo})}
        </Link>
    );
};

export default RepLink;
