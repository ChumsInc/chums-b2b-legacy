/**
 * Created by steve on 9/28/2016.
 */

const COUNTRIES = require('./countries').COUNTRIES;
const fs = require('fs');

let countries = [];
COUNTRIES.map(country => {
    countries.push({
        cca3: country.cca3,
        cca2: country.cca2,
        name: country.name.common
    });
});

fs.writeFile('min.countries.js', JSON.stringify(countries, ' ', 2), (err) => {
    if (err) {
        console.log(err);
    }
    console.log('done');
});
