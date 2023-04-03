import React from 'react';

const iconSource = {
    S: '/images/chums/icons/retainer_sm.png',
    M: '/images/chums/icons/retainer_md.png',
    L: '/images/chums/icons/retainer_lg.png',
}

const sizeName = {
    S: 'SMALL',
    M: 'MEDIUM',
    L: 'LARGE',
}

const SizeIcon = ({size}) => {
    const src = iconSource[size] ?? null;
    if (!src) {
        return null;
    }

    return (
        <img src={src} alt={size} style={{width: '25px', height: 'auto',  maxWidth: '100%', verticalAlign: 'middle'}}/>
    )
}

const SizeIconDescription = ({size}) => {
    if (!sizeName[size]) {
        return null;
    }
    return (
        <div className="visually-hidden">
            Fits size: {sizeName[size]}
        </div>
    )
}
const SizeIconContainer = ({size}) => {
    return (
        <div>
            <SizeIcon size={size}/>
            <SizeIconDescription size={size}/>
        </div>
    )
}

const SizeIconList = ({size}) => {

    const sizes = size.split(',').map(s => s.trim()).map(s => s.toLowerCase());
    if (!size || !sizes.length) {
        return null;
    }
    return (
        <div style={{display: 'flex', flexDirection: 'row'}}>
            {(sizes.includes('s') || sizes.includes('sm')) && (
                <SizeIconContainer size="S"/>
            )}
            {(sizes.includes('m') || sizes.includes('md')) && (
                <SizeIconContainer size="M"/>
            )}
            {(sizes.includes('l') || sizes.includes('lg')) && (
                <SizeIconContainer size="L"/>
            )}
        </div>
    )
}

export default SizeIconList;
