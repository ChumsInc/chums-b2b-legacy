import React from 'react';


const companyImage = (Company) => {
    switch (Company) {
    case 'chums':
    case 'CHI':
    case 'TST':
        return "/images/chums/icons/favicon-32x32.png";
    case 'bc':
    case 'BCS':
    case 'BCT':
        return "/images/bc/icons/bc-icon-3.png";
    default:
        return null;
    }
};

const CompanyIndicator = ({company = 'chums'}) => {
    const src = companyImage(company);
    return !!src ? (<img src={src} alt={company} className="company-indicator"/>) : null
};


export default CompanyIndicator;
