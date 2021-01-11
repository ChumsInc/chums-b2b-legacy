export function toAlpha3(code = '') {
    if (code.length === 3) {
        return code;
    }
    let alpha3 = '';
    COUNTRIES
        .filter(c => c.cca2 === code)
        .map(c => {
            alpha3 = c.cca3;
        });
    return alpha3;
}

export const COUNTRIES = [
    {
        "cca3": "ABW",
        "name": {
            "common": "Aruba"
        }
    },
    {
        "cca3": "AFG",
        "name": {
            "common": "Afghanistan"
        }
    },
    {
        "cca3": "AGO",
        "name": {
            "common": "Angola"
        }
    },
    {
        "cca3": "AIA",
        "name": {
            "common": "Anguilla"
        }
    },
    {
        "cca3": "ALA",
        "name": {
            "common": "Åland Islands"
        }
    },
    {
        "cca3": "ALB",
        "name": {
            "common": "Albania"
        }
    },
    {
        "cca3": "AND",
        "name": {
            "common": "Andorra"
        }
    },
    {
        "cca3": "ARE",
        "name": {
            "common": "United Arab Emirates"
        }
    },
    {
        "cca3": "ARG",
        "name": {
            "common": "Argentina"
        }
    },
    {
        "cca3": "ARM",
        "name": {
            "common": "Armenia"
        }
    },
    {
        "cca3": "ASM",
        "name": {
            "common": "American Samoa"
        }
    },
    {
        "cca3": "ATA",
        "name": {
            "common": "Antarctica"
        }
    },
    {
        "cca3": "ATF",
        "name": {
            "common": "French Southern and Antarctic Lands"
        }
    },
    {
        "cca3": "ATG",
        "name": {
            "common": "Antigua and Barbuda"
        }
    },
    {
        "cca3": "AUS",
        "name": {
            "common": "Australia"
        }
    },
    {
        "cca3": "AUT",
        "name": {
            "common": "Austria"
        }
    },
    {
        "cca3": "AZE",
        "name": {
            "common": "Azerbaijan"
        }
    },
    {
        "cca3": "BDI",
        "name": {
            "common": "Burundi"
        }
    },
    {
        "cca3": "BEL",
        "name": {
            "common": "Belgium"
        }
    },
    {
        "cca3": "BEN",
        "name": {
            "common": "Benin"
        }
    },
    {
        "cca3": "BFA",
        "name": {
            "common": "Burkina Faso"
        }
    },
    {
        "cca3": "BGD",
        "name": {
            "common": "Bangladesh"
        }
    },
    {
        "cca3": "BGR",
        "name": {
            "common": "Bulgaria"
        }
    },
    {
        "cca3": "BHR",
        "name": {
            "common": "Bahrain"
        }
    },
    {
        "cca3": "BHS",
        "name": {
            "common": "Bahamas"
        }
    },
    {
        "cca3": "BIH",
        "name": {
            "common": "Bosnia and Herzegovina"
        }
    },
    {
        "cca3": "BLM",
        "name": {
            "common": "Saint Barthélemy"
        }
    },
    {
        "cca3": "BLR",
        "name": {
            "common": "Belarus"
        }
    },
    {
        "cca3": "BLZ",
        "name": {
            "common": "Belize"
        }
    },
    {
        "cca3": "BMU",
        "name": {
            "common": "Bermuda"
        }
    },
    {
        "cca3": "BOL",
        "name": {
            "common": "Bolivia"
        }
    },
    {
        "cca3": "BRA",
        "name": {
            "common": "Brazil"
        }
    },
    {
        "cca3": "BRB",
        "name": {
            "common": "Barbados"
        }
    },
    {
        "cca3": "BRN",
        "name": {
            "common": "Brunei"
        }
    },
    {
        "cca3": "BTN",
        "name": {
            "common": "Bhutan"
        }
    },
    {
        "cca3": "BVT",
        "name": {
            "common": "Bouvet Island"
        }
    },
    {
        "cca3": "BWA",
        "name": {
            "common": "Botswana"
        }
    },
    {
        "cca3": "CAF",
        "name": {
            "common": "Central African Republic"
        }
    },
    {
        "cca3": "CAN",
        "name": {
            "common": "Canada"
        }
    },
    {
        "cca3": "CCK",
        "name": {
            "common": "Cocos (Keeling) Islands"
        }
    },
    {
        "cca3": "CHE",
        "name": {
            "common": "Switzerland"
        }
    },
    {
        "cca3": "CHL",
        "name": {
            "common": "Chile"
        }
    },
    {
        "cca3": "CHN",
        "name": {
            "common": "China"
        }
    },
    {
        "cca3": "CIV",
        "name": {
            "common": "Ivory Coast"
        }
    },
    {
        "cca3": "CMR",
        "name": {
            "common": "Cameroon"
        }
    },
    {
        "cca3": "COD",
        "name": {
            "common": "DR Congo"
        }
    },
    {
        "cca3": "COG",
        "name": {
            "common": "Republic of the Congo"
        }
    },
    {
        "cca3": "COK",
        "name": {
            "common": "Cook Islands"
        }
    },
    {
        "cca3": "COL",
        "name": {
            "common": "Colombia"
        }
    },
    {
        "cca3": "COM",
        "name": {
            "common": "Comoros"
        }
    },
    {
        "cca3": "CPV",
        "name": {
            "common": "Cape Verde"
        }
    },
    {
        "cca3": "CRI",
        "name": {
            "common": "Costa Rica"
        }
    },
    {
        "cca3": "CUB",
        "name": {
            "common": "Cuba"
        }
    },
    {
        "cca3": "CUW",
        "name": {
            "common": "Curaçao"
        }
    },
    {
        "cca3": "CXR",
        "name": {
            "common": "Christmas Island"
        }
    },
    {
        "cca3": "CYM",
        "name": {
            "common": "Cayman Islands"
        }
    },
    {
        "cca3": "CYP",
        "name": {
            "common": "Cyprus"
        }
    },
    {
        "cca3": "CZE",
        "name": {
            "common": "Czech Republic"
        }
    },
    {
        "cca3": "DEU",
        "name": {
            "common": "Germany"
        }
    },
    {
        "cca3": "DJI",
        "name": {
            "common": "Djibouti"
        }
    },
    {
        "cca3": "DMA",
        "name": {
            "common": "Dominica"
        }
    },
    {
        "cca3": "DNK",
        "name": {
            "common": "Denmark"
        }
    },
    {
        "cca3": "DOM",
        "name": {
            "common": "Dominican Republic"
        }
    },
    {
        "cca3": "DZA",
        "name": {
            "common": "Algeria"
        }
    },
    {
        "cca3": "ECU",
        "name": {
            "common": "Ecuador"
        }
    },
    {
        "cca3": "EGY",
        "name": {
            "common": "Egypt"
        }
    },
    {
        "cca3": "ERI",
        "name": {
            "common": "Eritrea"
        }
    },
    {
        "cca3": "ESH",
        "name": {
            "common": "Western Sahara"
        }
    },
    {
        "cca3": "ESP",
        "name": {
            "common": "Spain"
        }
    },
    {
        "cca3": "EST",
        "name": {
            "common": "Estonia"
        }
    },
    {
        "cca3": "ETH",
        "name": {
            "common": "Ethiopia"
        }
    },
    {
        "cca3": "FIN",
        "name": {
            "common": "Finland"
        }
    },
    {
        "cca3": "FJI",
        "name": {
            "common": "Fiji"
        }
    },
    {
        "cca3": "FLK",
        "name": {
            "common": "Falkland Islands"
        }
    },
    {
        "cca3": "FRA",
        "name": {
            "common": "France"
        }
    },
    {
        "cca3": "FRO",
        "name": {
            "common": "Faroe Islands"
        }
    },
    {
        "cca3": "FSM",
        "name": {
            "common": "Micronesia"
        }
    },
    {
        "cca3": "GAB",
        "name": {
            "common": "Gabon"
        }
    },
    {
        "cca3": "GBR",
        "name": {
            "common": "United Kingdom"
        }
    },
    {
        "cca3": "GEO",
        "name": {
            "common": "Georgia"
        }
    },
    {
        "cca3": "GGY",
        "name": {
            "common": "Guernsey"
        }
    },
    {
        "cca3": "GHA",
        "name": {
            "common": "Ghana"
        }
    },
    {
        "cca3": "GIB",
        "name": {
            "common": "Gibraltar"
        }
    },
    {
        "cca3": "GIN",
        "name": {
            "common": "Guinea"
        }
    },
    {
        "cca3": "GLP",
        "name": {
            "common": "Guadeloupe"
        }
    },
    {
        "cca3": "GMB",
        "name": {
            "common": "Gambia"
        }
    },
    {
        "cca3": "GNB",
        "name": {
            "common": "Guinea-Bissau"
        }
    },
    {
        "cca3": "GNQ",
        "name": {
            "common": "Equatorial Guinea"
        }
    },
    {
        "cca3": "GRC",
        "name": {
            "common": "Greece"
        }
    },
    {
        "cca3": "GRD",
        "name": {
            "common": "Grenada"
        }
    },
    {
        "cca3": "GRL",
        "name": {
            "common": "Greenland"
        }
    },
    {
        "cca3": "GTM",
        "name": {
            "common": "Guatemala"
        }
    },
    {
        "cca3": "GUF",
        "name": {
            "common": "French Guiana"
        }
    },
    {
        "cca3": "GUM",
        "name": {
            "common": "Guam"
        }
    },
    {
        "cca3": "GUY",
        "name": {
            "common": "Guyana"
        }
    },
    {
        "cca3": "HKG",
        "name": {
            "common": "Hong Kong"
        }
    },
    {
        "cca3": "HMD",
        "name": {
            "common": "Heard Island and McDonald Islands"
        }
    },
    {
        "cca3": "HND",
        "name": {
            "common": "Honduras"
        }
    },
    {
        "cca3": "HRV",
        "name": {
            "common": "Croatia"
        }
    },
    {
        "cca3": "HTI",
        "name": {
            "common": "Haiti"
        }
    },
    {
        "cca3": "HUN",
        "name": {
            "common": "Hungary"
        }
    },
    {
        "cca3": "IDN",
        "name": {
            "common": "Indonesia"
        }
    },
    {
        "cca3": "IMN",
        "name": {
            "common": "Isle of Man"
        }
    },
    {
        "cca3": "IND",
        "name": {
            "common": "India"
        }
    },
    {
        "cca3": "IOT",
        "name": {
            "common": "British Indian Ocean Territory"
        }
    },
    {
        "cca3": "IRL",
        "name": {
            "common": "Ireland"
        }
    },
    {
        "cca3": "IRN",
        "name": {
            "common": "Iran"
        }
    },
    {
        "cca3": "IRQ",
        "name": {
            "common": "Iraq"
        }
    },
    {
        "cca3": "ISL",
        "name": {
            "common": "Iceland"
        }
    },
    {
        "cca3": "ISR",
        "name": {
            "common": "Israel"
        }
    },
    {
        "cca3": "ITA",
        "name": {
            "common": "Italy"
        }
    },
    {
        "cca3": "JAM",
        "name": {
            "common": "Jamaica"
        }
    },
    {
        "cca3": "JEY",
        "name": {
            "common": "Jersey"
        }
    },
    {
        "cca3": "JOR",
        "name": {
            "common": "Jordan"
        }
    },
    {
        "cca3": "JPN",
        "name": {
            "common": "Japan"
        }
    },
    {
        "cca3": "KAZ",
        "name": {
            "common": "Kazakhstan"
        }
    },
    {
        "cca3": "KEN",
        "name": {
            "common": "Kenya"
        }
    },
    {
        "cca3": "KGZ",
        "name": {
            "common": "Kyrgyzstan"
        }
    },
    {
        "cca3": "KHM",
        "name": {
            "common": "Cambodia"
        }
    },
    {
        "cca3": "KIR",
        "name": {
            "common": "Kiribati"
        }
    },
    {
        "cca3": "KNA",
        "name": {
            "common": "Saint Kitts and Nevis"
        }
    },
    {
        "cca3": "KOR",
        "name": {
            "common": "South Korea"
        }
    },
    {
        "cca3": "UNK",
        "name": {
            "common": "Kosovo"
        }
    },
    {
        "cca3": "KWT",
        "name": {
            "common": "Kuwait"
        }
    },
    {
        "cca3": "LAO",
        "name": {
            "common": "Laos"
        }
    },
    {
        "cca3": "LBN",
        "name": {
            "common": "Lebanon"
        }
    },
    {
        "cca3": "LBR",
        "name": {
            "common": "Liberia"
        }
    },
    {
        "cca3": "LBY",
        "name": {
            "common": "Libya"
        }
    },
    {
        "cca3": "LCA",
        "name": {
            "common": "Saint Lucia"
        }
    },
    {
        "cca3": "LIE",
        "name": {
            "common": "Liechtenstein"
        }
    },
    {
        "cca3": "LKA",
        "name": {
            "common": "Sri Lanka"
        }
    },
    {
        "cca3": "LSO",
        "name": {
            "common": "Lesotho"
        }
    },
    {
        "cca3": "LTU",
        "name": {
            "common": "Lithuania"
        }
    },
    {
        "cca3": "LUX",
        "name": {
            "common": "Luxembourg"
        }
    },
    {
        "cca3": "LVA",
        "name": {
            "common": "Latvia"
        }
    },
    {
        "cca3": "MAC",
        "name": {
            "common": "Macau"
        }
    },
    {
        "cca3": "MAF",
        "name": {
            "common": "Saint Martin"
        }
    },
    {
        "cca3": "MAR",
        "name": {
            "common": "Morocco"
        }
    },
    {
        "cca3": "MCO",
        "name": {
            "common": "Monaco"
        }
    },
    {
        "cca3": "MDA",
        "name": {
            "common": "Moldova"
        }
    },
    {
        "cca3": "MDG",
        "name": {
            "common": "Madagascar"
        }
    },
    {
        "cca3": "MDV",
        "name": {
            "common": "Maldives"
        }
    },
    {
        "cca3": "MEX",
        "name": {
            "common": "Mexico"
        }
    },
    {
        "cca3": "MHL",
        "name": {
            "common": "Marshall Islands"
        }
    },
    {
        "cca3": "MKD",
        "name": {
            "common": "Macedonia"
        }
    },
    {
        "cca3": "MLI",
        "name": {
            "common": "Mali"
        }
    },
    {
        "cca3": "MLT",
        "name": {
            "common": "Malta"
        }
    },
    {
        "cca3": "MMR",
        "name": {
            "common": "Myanmar"
        }
    },
    {
        "cca3": "MNE",
        "name": {
            "common": "Montenegro"
        }
    },
    {
        "cca3": "MNG",
        "name": {
            "common": "Mongolia"
        }
    },
    {
        "cca3": "MNP",
        "name": {
            "common": "Northern Mariana Islands"
        }
    },
    {
        "cca3": "MOZ",
        "name": {
            "common": "Mozambique"
        }
    },
    {
        "cca3": "MRT",
        "name": {
            "common": "Mauritania"
        }
    },
    {
        "cca3": "MSR",
        "name": {
            "common": "Montserrat"
        }
    },
    {
        "cca3": "MTQ",
        "name": {
            "common": "Martinique"
        }
    },
    {
        "cca3": "MUS",
        "name": {
            "common": "Mauritius"
        }
    },
    {
        "cca3": "MWI",
        "name": {
            "common": "Malawi"
        }
    },
    {
        "cca3": "MYS",
        "name": {
            "common": "Malaysia"
        }
    },
    {
        "cca3": "MYT",
        "name": {
            "common": "Mayotte"
        }
    },
    {
        "cca3": "NAM",
        "name": {
            "common": "Namibia"
        }
    },
    {
        "cca3": "NCL",
        "name": {
            "common": "New Caledonia"
        }
    },
    {
        "cca3": "NER",
        "name": {
            "common": "Niger"
        }
    },
    {
        "cca3": "NFK",
        "name": {
            "common": "Norfolk Island"
        }
    },
    {
        "cca3": "NGA",
        "name": {
            "common": "Nigeria"
        }
    },
    {
        "cca3": "NIC",
        "name": {
            "common": "Nicaragua"
        }
    },
    {
        "cca3": "NIU",
        "name": {
            "common": "Niue"
        }
    },
    {
        "cca3": "NLD",
        "name": {
            "common": "Netherlands"
        }
    },
    {
        "cca3": "NOR",
        "name": {
            "common": "Norway"
        }
    },
    {
        "cca3": "NPL",
        "name": {
            "common": "Nepal"
        }
    },
    {
        "cca3": "NRU",
        "name": {
            "common": "Nauru"
        }
    },
    {
        "cca3": "NZL",
        "name": {
            "common": "New Zealand"
        }
    },
    {
        "cca3": "OMN",
        "name": {
            "common": "Oman"
        }
    },
    {
        "cca3": "PAK",
        "name": {
            "common": "Pakistan"
        }
    },
    {
        "cca3": "PAN",
        "name": {
            "common": "Panama"
        }
    },
    {
        "cca3": "PCN",
        "name": {
            "common": "Pitcairn Islands"
        }
    },
    {
        "cca3": "PER",
        "name": {
            "common": "Peru"
        }
    },
    {
        "cca3": "PHL",
        "name": {
            "common": "Philippines"
        }
    },
    {
        "cca3": "PLW",
        "name": {
            "common": "Palau"
        }
    },
    {
        "cca3": "PNG",
        "name": {
            "common": "Papua New Guinea"
        }
    },
    {
        "cca3": "POL",
        "name": {
            "common": "Poland"
        }
    },
    {
        "cca3": "PRI",
        "name": {
            "common": "Puerto Rico"
        }
    },
    {
        "cca3": "PRK",
        "name": {
            "common": "North Korea"
        }
    },
    {
        "cca3": "PRT",
        "name": {
            "common": "Portugal"
        }
    },
    {
        "cca3": "PRY",
        "name": {
            "common": "Paraguay"
        }
    },
    {
        "cca3": "PSE",
        "name": {
            "common": "Palestine"
        }
    },
    {
        "cca3": "PYF",
        "name": {
            "common": "French Polynesia"
        }
    },
    {
        "cca3": "QAT",
        "name": {
            "common": "Qatar"
        }
    },
    {
        "cca3": "REU",
        "name": {
            "common": "Réunion"
        }
    },
    {
        "cca3": "ROU",
        "name": {
            "common": "Romania"
        }
    },
    {
        "cca3": "RUS",
        "name": {
            "common": "Russia"
        }
    },
    {
        "cca3": "RWA",
        "name": {
            "common": "Rwanda"
        }
    },
    {
        "cca3": "SAU",
        "name": {
            "common": "Saudi Arabia"
        }
    },
    {
        "cca3": "SDN",
        "name": {
            "common": "Sudan"
        }
    },
    {
        "cca3": "SEN",
        "name": {
            "common": "Senegal"
        }
    },
    {
        "cca3": "SGP",
        "name": {
            "common": "Singapore"
        }
    },
    {
        "cca3": "SGS",
        "name": {
            "common": "South Georgia"
        }
    },
    {
        "cca3": "SJM",
        "name": {
            "common": "Svalbard and Jan Mayen"
        }
    },
    {
        "cca3": "SLB",
        "name": {
            "common": "Solomon Islands"
        }
    },
    {
        "cca3": "SLE",
        "name": {
            "common": "Sierra Leone"
        }
    },
    {
        "cca3": "SLV",
        "name": {
            "common": "El Salvador"
        }
    },
    {
        "cca3": "SMR",
        "name": {
            "common": "San Marino"
        }
    },
    {
        "cca3": "SOM",
        "name": {
            "common": "Somalia"
        }
    },
    {
        "cca3": "SPM",
        "name": {
            "common": "Saint Pierre and Miquelon"
        }
    },
    {
        "cca3": "SRB",
        "name": {
            "common": "Serbia"
        }
    },
    {
        "cca3": "SSD",
        "name": {
            "common": "South Sudan"
        }
    },
    {
        "cca3": "STP",
        "name": {
            "common": "São Tomé and Príncipe"
        }
    },
    {
        "cca3": "SUR",
        "name": {
            "common": "Suriname"
        }
    },
    {
        "cca3": "SVK",
        "name": {
            "common": "Slovakia"
        }
    },
    {
        "cca3": "SVN",
        "name": {
            "common": "Slovenia"
        }
    },
    {
        "cca3": "SWE",
        "name": {
            "common": "Sweden"
        }
    },
    {
        "cca3": "SWZ",
        "name": {
            "common": "Swaziland"
        }
    },
    {
        "cca3": "SXM",
        "name": {
            "common": "Sint Maarten"
        }
    },
    {
        "cca3": "SYC",
        "name": {
            "common": "Seychelles"
        }
    },
    {
        "cca3": "SYR",
        "name": {
            "common": "Syria"
        }
    },
    {
        "cca3": "TCA",
        "name": {
            "common": "Turks and Caicos Islands"
        }
    },
    {
        "cca3": "TCD",
        "name": {
            "common": "Chad"
        }
    },
    {
        "cca3": "TGO",
        "name": {
            "common": "Togo"
        }
    },
    {
        "cca3": "THA",
        "name": {
            "common": "Thailand"
        }
    },
    {
        "cca3": "TJK",
        "name": {
            "common": "Tajikistan"
        }
    },
    {
        "cca3": "TKL",
        "name": {
            "common": "Tokelau"
        }
    },
    {
        "cca3": "TKM",
        "name": {
            "common": "Turkmenistan"
        }
    },
    {
        "cca3": "TLS",
        "name": {
            "common": "Timor-Leste"
        }
    },
    {
        "cca3": "TON",
        "name": {
            "common": "Tonga"
        }
    },
    {
        "cca3": "TTO",
        "name": {
            "common": "Trinidad and Tobago"
        }
    },
    {
        "cca3": "TUN",
        "name": {
            "common": "Tunisia"
        }
    },
    {
        "cca3": "TUR",
        "name": {
            "common": "Turkey"
        }
    },
    {
        "cca3": "TUV",
        "name": {
            "common": "Tuvalu"
        }
    },
    {
        "cca3": "TWN",
        "name": {
            "common": "Taiwan"
        }
    },
    {
        "cca3": "TZA",
        "name": {
            "common": "Tanzania"
        }
    },
    {
        "cca3": "UGA",
        "name": {
            "common": "Uganda"
        }
    },
    {
        "cca3": "UKR",
        "name": {
            "common": "Ukraine"
        }
    },
    {
        "cca3": "UMI",
        "name": {
            "common": "United States Minor Outlying Islands"
        }
    },
    {
        "cca3": "URY",
        "name": {
            "common": "Uruguay"
        }
    },
    {
        "cca3": "USA",
        "name": {
            "common": "United States"
        }
    },
    {
        "cca3": "UZB",
        "name": {
            "common": "Uzbekistan"
        }
    },
    {
        "cca3": "VAT",
        "name": {
            "common": "Vatican City"
        }
    },
    {
        "cca3": "VCT",
        "name": {
            "common": "Saint Vincent and the Grenadines"
        }
    },
    {
        "cca3": "VEN",
        "name": {
            "common": "Venezuela"
        }
    },
    {
        "cca3": "VGB",
        "name": {
            "common": "British Virgin Islands"
        }
    },
    {
        "cca3": "VIR",
        "name": {
            "common": "United States Virgin Islands"
        }
    },
    {
        "cca3": "VNM",
        "name": {
            "common": "Vietnam"
        }
    },
    {
        "cca3": "VUT",
        "name": {
            "common": "Vanuatu"
        }
    },
    {
        "cca3": "WLF",
        "name": {
            "common": "Wallis and Futuna"
        }
    },
    {
        "cca3": "WSM",
        "name": {
            "common": "Samoa"
        }
    },
    {
        "cca3": "YEM",
        "name": {
            "common": "Yemen"
        }
    },
    {
        "cca3": "ZAF",
        "name": {
            "common": "South Africa"
        }
    },
    {
        "cca3": "ZMB",
        "name": {
            "common": "Zambia"
        }
    },
    {
        "cca3": "ZWE",
        "name": {
            "common": "Zimbabwe"
        }
    }
];