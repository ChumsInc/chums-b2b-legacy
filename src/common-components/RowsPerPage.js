import React from 'react';

const RowsPerPage = ({value = 25, onChange}) => {
    const changeHandler = (ev) => {
        onChange(Number(ev.target.value));
    }
    return (
        <div className="input-group input-group-sm">
            <label className="input-group-text">Rows Per Page</label>
            <select value={value} className="form-select form-select-sm" onChange={changeHandler}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={250}>250</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
            </select>
        </div>
    )
};

export default RowsPerPage;
