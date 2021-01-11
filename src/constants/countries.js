export function toAlpha3(code = '') {
    if (code === null || code === '') {
        return 'USA';
    }
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
        "cca2": "AW",
        "name": "Aruba"
    },
    {
        "cca3": "AFG",
        "cca2": "AF",
        "name": "Afghanistan"
    },
    {
        "cca3": "AGO",
        "cca2": "AO",
        "name": "Angola"
    },
    {
        "cca3": "AIA",
        "cca2": "AI",
        "name": "Anguilla"
    },
    {
        "cca3": "ALA",
        "cca2": "AX",
        "name": "Åland Islands"
    },
    {
        "cca3": "ALB",
        "cca2": "AL",
        "name": "Albania"
    },
    {
        "cca3": "AND",
        "cca2": "AD",
        "name": "Andorra"
    },
    {
        "cca3": "ARE",
        "cca2": "AE",
        "name": "United Arab Emirates"
    },
    {
        "cca3": "ARG",
        "cca2": "AR",
        "name": "Argentina"
    },
    {
        "cca3": "ARM",
        "cca2": "AM",
        "name": "Armenia"
    },
    {
        "cca3": "ASM",
        "cca2": "AS",
        "name": "American Samoa"
    },
    {
        "cca3": "ATA",
        "cca2": "AQ",
        "name": "Antarctica"
    },
    {
        "cca3": "ATF",
        "cca2": "TF",
        "name": "French Southern and Antarctic Lands"
    },
    {
        "cca3": "ATG",
        "cca2": "AG",
        "name": "Antigua and Barbuda"
    },
    {
        "cca3": "AUS",
        "cca2": "AU",
        "name": "Australia"
    },
    {
        "cca3": "AUT",
        "cca2": "AT",
        "name": "Austria"
    },
    {
        "cca3": "AZE",
        "cca2": "AZ",
        "name": "Azerbaijan"
    },
    {
        "cca3": "BDI",
        "cca2": "BI",
        "name": "Burundi"
    },
    {
        "cca3": "BEL",
        "cca2": "BE",
        "name": "Belgium"
    },
    {
        "cca3": "BEN",
        "cca2": "BJ",
        "name": "Benin"
    },
    {
        "cca3": "BFA",
        "cca2": "BF",
        "name": "Burkina Faso"
    },
    {
        "cca3": "BGD",
        "cca2": "BD",
        "name": "Bangladesh"
    },
    {
        "cca3": "BGR",
        "cca2": "BG",
        "name": "Bulgaria"
    },
    {
        "cca3": "BHR",
        "cca2": "BH",
        "name": "Bahrain"
    },
    {
        "cca3": "BHS",
        "cca2": "BS",
        "name": "Bahamas"
    },
    {
        "cca3": "BIH",
        "cca2": "BA",
        "name": "Bosnia and Herzegovina"
    },
    {
        "cca3": "BLM",
        "cca2": "BL",
        "name": "Saint Barthélemy"
    },
    {
        "cca3": "BLR",
        "cca2": "BY",
        "name": "Belarus"
    },
    {
        "cca3": "BLZ",
        "cca2": "BZ",
        "name": "Belize"
    },
    {
        "cca3": "BMU",
        "cca2": "BM",
        "name": "Bermuda"
    },
    {
        "cca3": "BOL",
        "cca2": "BO",
        "name": "Bolivia"
    },
    {
        "cca3": "BRA",
        "cca2": "BR",
        "name": "Brazil"
    },
    {
        "cca3": "BRB",
        "cca2": "BB",
        "name": "Barbados"
    },
    {
        "cca3": "BRN",
        "cca2": "BN",
        "name": "Brunei"
    },
    {
        "cca3": "BTN",
        "cca2": "BT",
        "name": "Bhutan"
    },
    {
        "cca3": "BVT",
        "cca2": "BV",
        "name": "Bouvet Island"
    },
    {
        "cca3": "BWA",
        "cca2": "BW",
        "name": "Botswana"
    },
    {
        "cca3": "CAF",
        "cca2": "CF",
        "name": "Central African Republic"
    },
    {
        "cca3": "CAN",
        "cca2": "CA",
        "name": "Canada"
    },
    {
        "cca3": "CCK",
        "cca2": "CC",
        "name": "Cocos (Keeling) Islands"
    },
    {
        "cca3": "CHE",
        "cca2": "CH",
        "name": "Switzerland"
    },
    {
        "cca3": "CHL",
        "cca2": "CL",
        "name": "Chile"
    },
    {
        "cca3": "CHN",
        "cca2": "CN",
        "name": "China"
    },
    {
        "cca3": "CIV",
        "cca2": "CI",
        "name": "Ivory Coast"
    },
    {
        "cca3": "CMR",
        "cca2": "CM",
        "name": "Cameroon"
    },
    {
        "cca3": "COD",
        "cca2": "CD",
        "name": "DR Congo"
    },
    {
        "cca3": "COG",
        "cca2": "CG",
        "name": "Republic of the Congo"
    },
    {
        "cca3": "COK",
        "cca2": "CK",
        "name": "Cook Islands"
    },
    {
        "cca3": "COL",
        "cca2": "CO",
        "name": "Colombia"
    },
    {
        "cca3": "COM",
        "cca2": "KM",
        "name": "Comoros"
    },
    {
        "cca3": "CPV",
        "cca2": "CV",
        "name": "Cape Verde"
    },
    {
        "cca3": "CRI",
        "cca2": "CR",
        "name": "Costa Rica"
    },
    {
        "cca3": "CUB",
        "cca2": "CU",
        "name": "Cuba"
    },
    {
        "cca3": "CUW",
        "cca2": "CW",
        "name": "Curaçao"
    },
    {
        "cca3": "CXR",
        "cca2": "CX",
        "name": "Christmas Island"
    },
    {
        "cca3": "CYM",
        "cca2": "KY",
        "name": "Cayman Islands"
    },
    {
        "cca3": "CYP",
        "cca2": "CY",
        "name": "Cyprus"
    },
    {
        "cca3": "CZE",
        "cca2": "CZ",
        "name": "Czech Republic"
    },
    {
        "cca3": "DEU",
        "cca2": "DE",
        "name": "Germany"
    },
    {
        "cca3": "DJI",
        "cca2": "DJ",
        "name": "Djibouti"
    },
    {
        "cca3": "DMA",
        "cca2": "DM",
        "name": "Dominica"
    },
    {
        "cca3": "DNK",
        "cca2": "DK",
        "name": "Denmark"
    },
    {
        "cca3": "DOM",
        "cca2": "DO",
        "name": "Dominican Republic"
    },
    {
        "cca3": "DZA",
        "cca2": "DZ",
        "name": "Algeria"
    },
    {
        "cca3": "ECU",
        "cca2": "EC",
        "name": "Ecuador"
    },
    {
        "cca3": "EGY",
        "cca2": "EG",
        "name": "Egypt"
    },
    {
        "cca3": "ERI",
        "cca2": "ER",
        "name": "Eritrea"
    },
    {
        "cca3": "ESH",
        "cca2": "EH",
        "name": "Western Sahara"
    },
    {
        "cca3": "ESP",
        "cca2": "ES",
        "name": "Spain"
    },
    {
        "cca3": "EST",
        "cca2": "EE",
        "name": "Estonia"
    },
    {
        "cca3": "ETH",
        "cca2": "ET",
        "name": "Ethiopia"
    },
    {
        "cca3": "FIN",
        "cca2": "FI",
        "name": "Finland"
    },
    {
        "cca3": "FJI",
        "cca2": "FJ",
        "name": "Fiji"
    },
    {
        "cca3": "FLK",
        "cca2": "FK",
        "name": "Falkland Islands"
    },
    {
        "cca3": "FRA",
        "cca2": "FR",
        "name": "France"
    },
    {
        "cca3": "FRO",
        "cca2": "FO",
        "name": "Faroe Islands"
    },
    {
        "cca3": "FSM",
        "cca2": "FM",
        "name": "Micronesia"
    },
    {
        "cca3": "GAB",
        "cca2": "GA",
        "name": "Gabon"
    },
    {
        "cca3": "GBR",
        "cca2": "GB",
        "name": "United Kingdom"
    },
    {
        "cca3": "GEO",
        "cca2": "GE",
        "name": "Georgia"
    },
    {
        "cca3": "GGY",
        "cca2": "GG",
        "name": "Guernsey"
    },
    {
        "cca3": "GHA",
        "cca2": "GH",
        "name": "Ghana"
    },
    {
        "cca3": "GIB",
        "cca2": "GI",
        "name": "Gibraltar"
    },
    {
        "cca3": "GIN",
        "cca2": "GN",
        "name": "Guinea"
    },
    {
        "cca3": "GLP",
        "cca2": "GP",
        "name": "Guadeloupe"
    },
    {
        "cca3": "GMB",
        "cca2": "GM",
        "name": "Gambia"
    },
    {
        "cca3": "GNB",
        "cca2": "GW",
        "name": "Guinea-Bissau"
    },
    {
        "cca3": "GNQ",
        "cca2": "GQ",
        "name": "Equatorial Guinea"
    },
    {
        "cca3": "GRC",
        "cca2": "GR",
        "name": "Greece"
    },
    {
        "cca3": "GRD",
        "cca2": "GD",
        "name": "Grenada"
    },
    {
        "cca3": "GRL",
        "cca2": "GL",
        "name": "Greenland"
    },
    {
        "cca3": "GTM",
        "cca2": "GT",
        "name": "Guatemala"
    },
    {
        "cca3": "GUF",
        "cca2": "GF",
        "name": "French Guiana"
    },
    {
        "cca3": "GUM",
        "cca2": "GU",
        "name": "Guam"
    },
    {
        "cca3": "GUY",
        "cca2": "GY",
        "name": "Guyana"
    },
    {
        "cca3": "HKG",
        "cca2": "HK",
        "name": "Hong Kong"
    },
    {
        "cca3": "HMD",
        "cca2": "HM",
        "name": "Heard Island and McDonald Islands"
    },
    {
        "cca3": "HND",
        "cca2": "HN",
        "name": "Honduras"
    },
    {
        "cca3": "HRV",
        "cca2": "HR",
        "name": "Croatia"
    },
    {
        "cca3": "HTI",
        "cca2": "HT",
        "name": "Haiti"
    },
    {
        "cca3": "HUN",
        "cca2": "HU",
        "name": "Hungary"
    },
    {
        "cca3": "IDN",
        "cca2": "ID",
        "name": "Indonesia"
    },
    {
        "cca3": "IMN",
        "cca2": "IM",
        "name": "Isle of Man"
    },
    {
        "cca3": "IND",
        "cca2": "IN",
        "name": "India"
    },
    {
        "cca3": "IOT",
        "cca2": "IO",
        "name": "British Indian Ocean Territory"
    },
    {
        "cca3": "IRL",
        "cca2": "IE",
        "name": "Ireland"
    },
    {
        "cca3": "IRN",
        "cca2": "IR",
        "name": "Iran"
    },
    {
        "cca3": "IRQ",
        "cca2": "IQ",
        "name": "Iraq"
    },
    {
        "cca3": "ISL",
        "cca2": "IS",
        "name": "Iceland"
    },
    {
        "cca3": "ISR",
        "cca2": "IL",
        "name": "Israel"
    },
    {
        "cca3": "ITA",
        "cca2": "IT",
        "name": "Italy"
    },
    {
        "cca3": "JAM",
        "cca2": "JM",
        "name": "Jamaica"
    },
    {
        "cca3": "JEY",
        "cca2": "JE",
        "name": "Jersey"
    },
    {
        "cca3": "JOR",
        "cca2": "JO",
        "name": "Jordan"
    },
    {
        "cca3": "JPN",
        "cca2": "JP",
        "name": "Japan"
    },
    {
        "cca3": "KAZ",
        "cca2": "KZ",
        "name": "Kazakhstan"
    },
    {
        "cca3": "KEN",
        "cca2": "KE",
        "name": "Kenya"
    },
    {
        "cca3": "KGZ",
        "cca2": "KG",
        "name": "Kyrgyzstan"
    },
    {
        "cca3": "KHM",
        "cca2": "KH",
        "name": "Cambodia"
    },
    {
        "cca3": "KIR",
        "cca2": "KI",
        "name": "Kiribati"
    },
    {
        "cca3": "KNA",
        "cca2": "KN",
        "name": "Saint Kitts and Nevis"
    },
    {
        "cca3": "KOR",
        "cca2": "KR",
        "name": "South Korea"
    },
    {
        "cca3": "UNK",
        "cca2": "XK",
        "name": "Kosovo"
    },
    {
        "cca3": "KWT",
        "cca2": "KW",
        "name": "Kuwait"
    },
    {
        "cca3": "LAO",
        "cca2": "LA",
        "name": "Laos"
    },
    {
        "cca3": "LBN",
        "cca2": "LB",
        "name": "Lebanon"
    },
    {
        "cca3": "LBR",
        "cca2": "LR",
        "name": "Liberia"
    },
    {
        "cca3": "LBY",
        "cca2": "LY",
        "name": "Libya"
    },
    {
        "cca3": "LCA",
        "cca2": "LC",
        "name": "Saint Lucia"
    },
    {
        "cca3": "LIE",
        "cca2": "LI",
        "name": "Liechtenstein"
    },
    {
        "cca3": "LKA",
        "cca2": "LK",
        "name": "Sri Lanka"
    },
    {
        "cca3": "LSO",
        "cca2": "LS",
        "name": "Lesotho"
    },
    {
        "cca3": "LTU",
        "cca2": "LT",
        "name": "Lithuania"
    },
    {
        "cca3": "LUX",
        "cca2": "LU",
        "name": "Luxembourg"
    },
    {
        "cca3": "LVA",
        "cca2": "LV",
        "name": "Latvia"
    },
    {
        "cca3": "MAC",
        "cca2": "MO",
        "name": "Macau"
    },
    {
        "cca3": "MAF",
        "cca2": "MF",
        "name": "Saint Martin"
    },
    {
        "cca3": "MAR",
        "cca2": "MA",
        "name": "Morocco"
    },
    {
        "cca3": "MCO",
        "cca2": "MC",
        "name": "Monaco"
    },
    {
        "cca3": "MDA",
        "cca2": "MD",
        "name": "Moldova"
    },
    {
        "cca3": "MDG",
        "cca2": "MG",
        "name": "Madagascar"
    },
    {
        "cca3": "MDV",
        "cca2": "MV",
        "name": "Maldives"
    },
    {
        "cca3": "MEX",
        "cca2": "MX",
        "name": "Mexico"
    },
    {
        "cca3": "MHL",
        "cca2": "MH",
        "name": "Marshall Islands"
    },
    {
        "cca3": "MKD",
        "cca2": "MK",
        "name": "Macedonia"
    },
    {
        "cca3": "MLI",
        "cca2": "ML",
        "name": "Mali"
    },
    {
        "cca3": "MLT",
        "cca2": "MT",
        "name": "Malta"
    },
    {
        "cca3": "MMR",
        "cca2": "MM",
        "name": "Myanmar"
    },
    {
        "cca3": "MNE",
        "cca2": "ME",
        "name": "Montenegro"
    },
    {
        "cca3": "MNG",
        "cca2": "MN",
        "name": "Mongolia"
    },
    {
        "cca3": "MNP",
        "cca2": "MP",
        "name": "Northern Mariana Islands"
    },
    {
        "cca3": "MOZ",
        "cca2": "MZ",
        "name": "Mozambique"
    },
    {
        "cca3": "MRT",
        "cca2": "MR",
        "name": "Mauritania"
    },
    {
        "cca3": "MSR",
        "cca2": "MS",
        "name": "Montserrat"
    },
    {
        "cca3": "MTQ",
        "cca2": "MQ",
        "name": "Martinique"
    },
    {
        "cca3": "MUS",
        "cca2": "MU",
        "name": "Mauritius"
    },
    {
        "cca3": "MWI",
        "cca2": "MW",
        "name": "Malawi"
    },
    {
        "cca3": "MYS",
        "cca2": "MY",
        "name": "Malaysia"
    },
    {
        "cca3": "MYT",
        "cca2": "YT",
        "name": "Mayotte"
    },
    {
        "cca3": "NAM",
        "cca2": "NA",
        "name": "Namibia"
    },
    {
        "cca3": "NCL",
        "cca2": "NC",
        "name": "New Caledonia"
    },
    {
        "cca3": "NER",
        "cca2": "NE",
        "name": "Niger"
    },
    {
        "cca3": "NFK",
        "cca2": "NF",
        "name": "Norfolk Island"
    },
    {
        "cca3": "NGA",
        "cca2": "NG",
        "name": "Nigeria"
    },
    {
        "cca3": "NIC",
        "cca2": "NI",
        "name": "Nicaragua"
    },
    {
        "cca3": "NIU",
        "cca2": "NU",
        "name": "Niue"
    },
    {
        "cca3": "NLD",
        "cca2": "NL",
        "name": "Netherlands"
    },
    {
        "cca3": "NOR",
        "cca2": "NO",
        "name": "Norway"
    },
    {
        "cca3": "NPL",
        "cca2": "NP",
        "name": "Nepal"
    },
    {
        "cca3": "NRU",
        "cca2": "NR",
        "name": "Nauru"
    },
    {
        "cca3": "NZL",
        "cca2": "NZ",
        "name": "New Zealand"
    },
    {
        "cca3": "OMN",
        "cca2": "OM",
        "name": "Oman"
    },
    {
        "cca3": "PAK",
        "cca2": "PK",
        "name": "Pakistan"
    },
    {
        "cca3": "PAN",
        "cca2": "PA",
        "name": "Panama"
    },
    {
        "cca3": "PCN",
        "cca2": "PN",
        "name": "Pitcairn Islands"
    },
    {
        "cca3": "PER",
        "cca2": "PE",
        "name": "Peru"
    },
    {
        "cca3": "PHL",
        "cca2": "PH",
        "name": "Philippines"
    },
    {
        "cca3": "PLW",
        "cca2": "PW",
        "name": "Palau"
    },
    {
        "cca3": "PNG",
        "cca2": "PG",
        "name": "Papua New Guinea"
    },
    {
        "cca3": "POL",
        "cca2": "PL",
        "name": "Poland"
    },
    {
        "cca3": "PRI",
        "cca2": "PR",
        "name": "Puerto Rico"
    },
    {
        "cca3": "PRK",
        "cca2": "KP",
        "name": "North Korea"
    },
    {
        "cca3": "PRT",
        "cca2": "PT",
        "name": "Portugal"
    },
    {
        "cca3": "PRY",
        "cca2": "PY",
        "name": "Paraguay"
    },
    {
        "cca3": "PSE",
        "cca2": "PS",
        "name": "Palestine"
    },
    {
        "cca3": "PYF",
        "cca2": "PF",
        "name": "French Polynesia"
    },
    {
        "cca3": "QAT",
        "cca2": "QA",
        "name": "Qatar"
    },
    {
        "cca3": "REU",
        "cca2": "RE",
        "name": "Réunion"
    },
    {
        "cca3": "ROU",
        "cca2": "RO",
        "name": "Romania"
    },
    {
        "cca3": "RUS",
        "cca2": "RU",
        "name": "Russia"
    },
    {
        "cca3": "RWA",
        "cca2": "RW",
        "name": "Rwanda"
    },
    {
        "cca3": "SAU",
        "cca2": "SA",
        "name": "Saudi Arabia"
    },
    {
        "cca3": "SDN",
        "cca2": "SD",
        "name": "Sudan"
    },
    {
        "cca3": "SEN",
        "cca2": "SN",
        "name": "Senegal"
    },
    {
        "cca3": "SGP",
        "cca2": "SG",
        "name": "Singapore"
    },
    {
        "cca3": "SGS",
        "cca2": "GS",
        "name": "South Georgia"
    },
    {
        "cca3": "SJM",
        "cca2": "SJ",
        "name": "Svalbard and Jan Mayen"
    },
    {
        "cca3": "SLB",
        "cca2": "SB",
        "name": "Solomon Islands"
    },
    {
        "cca3": "SLE",
        "cca2": "SL",
        "name": "Sierra Leone"
    },
    {
        "cca3": "SLV",
        "cca2": "SV",
        "name": "El Salvador"
    },
    {
        "cca3": "SMR",
        "cca2": "SM",
        "name": "San Marino"
    },
    {
        "cca3": "SOM",
        "cca2": "SO",
        "name": "Somalia"
    },
    {
        "cca3": "SPM",
        "cca2": "PM",
        "name": "Saint Pierre and Miquelon"
    },
    {
        "cca3": "SRB",
        "cca2": "RS",
        "name": "Serbia"
    },
    {
        "cca3": "SSD",
        "cca2": "SS",
        "name": "South Sudan"
    },
    {
        "cca3": "STP",
        "cca2": "ST",
        "name": "São Tomé and Príncipe"
    },
    {
        "cca3": "SUR",
        "cca2": "SR",
        "name": "Suriname"
    },
    {
        "cca3": "SVK",
        "cca2": "SK",
        "name": "Slovakia"
    },
    {
        "cca3": "SVN",
        "cca2": "SI",
        "name": "Slovenia"
    },
    {
        "cca3": "SWE",
        "cca2": "SE",
        "name": "Sweden"
    },
    {
        "cca3": "SWZ",
        "cca2": "SZ",
        "name": "Swaziland"
    },
    {
        "cca3": "SXM",
        "cca2": "SX",
        "name": "Sint Maarten"
    },
    {
        "cca3": "SYC",
        "cca2": "SC",
        "name": "Seychelles"
    },
    {
        "cca3": "SYR",
        "cca2": "SY",
        "name": "Syria"
    },
    {
        "cca3": "TCA",
        "cca2": "TC",
        "name": "Turks and Caicos Islands"
    },
    {
        "cca3": "TCD",
        "cca2": "TD",
        "name": "Chad"
    },
    {
        "cca3": "TGO",
        "cca2": "TG",
        "name": "Togo"
    },
    {
        "cca3": "THA",
        "cca2": "TH",
        "name": "Thailand"
    },
    {
        "cca3": "TJK",
        "cca2": "TJ",
        "name": "Tajikistan"
    },
    {
        "cca3": "TKL",
        "cca2": "TK",
        "name": "Tokelau"
    },
    {
        "cca3": "TKM",
        "cca2": "TM",
        "name": "Turkmenistan"
    },
    {
        "cca3": "TLS",
        "cca2": "TL",
        "name": "Timor-Leste"
    },
    {
        "cca3": "TON",
        "cca2": "TO",
        "name": "Tonga"
    },
    {
        "cca3": "TTO",
        "cca2": "TT",
        "name": "Trinidad and Tobago"
    },
    {
        "cca3": "TUN",
        "cca2": "TN",
        "name": "Tunisia"
    },
    {
        "cca3": "TUR",
        "cca2": "TR",
        "name": "Turkey"
    },
    {
        "cca3": "TUV",
        "cca2": "TV",
        "name": "Tuvalu"
    },
    {
        "cca3": "TWN",
        "cca2": "TW",
        "name": "Taiwan"
    },
    {
        "cca3": "TZA",
        "cca2": "TZ",
        "name": "Tanzania"
    },
    {
        "cca3": "UGA",
        "cca2": "UG",
        "name": "Uganda"
    },
    {
        "cca3": "UKR",
        "cca2": "UA",
        "name": "Ukraine"
    },
    {
        "cca3": "UMI",
        "cca2": "UM",
        "name": "United States Minor Outlying Islands"
    },
    {
        "cca3": "URY",
        "cca2": "UY",
        "name": "Uruguay"
    },
    {
        "cca3": "USA",
        "cca2": "US",
        "name": "United States"
    },
    {
        "cca3": "UZB",
        "cca2": "UZ",
        "name": "Uzbekistan"
    },
    {
        "cca3": "VAT",
        "cca2": "VA",
        "name": "Vatican City"
    },
    {
        "cca3": "VCT",
        "cca2": "VC",
        "name": "Saint Vincent and the Grenadines"
    },
    {
        "cca3": "VEN",
        "cca2": "VE",
        "name": "Venezuela"
    },
    {
        "cca3": "VGB",
        "cca2": "VG",
        "name": "British Virgin Islands"
    },
    {
        "cca3": "VIR",
        "cca2": "VI",
        "name": "United States Virgin Islands"
    },
    {
        "cca3": "VNM",
        "cca2": "VN",
        "name": "Vietnam"
    },
    {
        "cca3": "VUT",
        "cca2": "VU",
        "name": "Vanuatu"
    },
    {
        "cca3": "WLF",
        "cca2": "WF",
        "name": "Wallis and Futuna"
    },
    {
        "cca3": "WSM",
        "cca2": "WS",
        "name": "Samoa"
    },
    {
        "cca3": "YEM",
        "cca2": "YE",
        "name": "Yemen"
    },
    {
        "cca3": "ZAF",
        "cca2": "ZA",
        "name": "South Africa"
    },
    {
        "cca3": "ZMB",
        "cca2": "ZM",
        "name": "Zambia"
    },
    {
        "cca3": "ZWE",
        "cca2": "ZW",
        "name": "Zimbabwe"
    }
];