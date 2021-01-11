// require('babel-register');

process.env.DEBUG = 'chums:*';

const path = require('path');
const fsPromises = require('fs').promises;
const express = require('express');
const favicon = require('serve-favicon');
const router = express.Router();
const compression = require('compression');
const {loadJSON} = require('./load-content');

const app = express();
app.use(compression());

// serve our static stuff like index.css
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use('/css', express.static('./public/css', {fallthrough: false}));
app.use('/js', express.static('./public/js', {fallthrough: false}));
app.use('/jquery', express.static('./public/jquery', {fallthrough: false}));
app.use('/images', express.static('./public/images', {fallthrough: false}));
app.set('view engine', 'pug');

router.get('*', async (req, res) => {
    const manifestFile = await fsPromises.readFile('./public/js/manifest.json');
    const manifestJSON = Buffer.from(manifestFile).toString();
    const state = await loadJSON('http://localhost:8081/preload/state');

    console.log('manifest.json', manifestJSON);
    let manifestFiles = {};

    try {
        manifestFiles = JSON.parse(manifestJSON || '{}');
    } catch (err) {
        console.log('error parsing manifest', err.message);
    }

    const manifest = {
        bundle: `/js${manifestFiles['main.js']}`,
        vendors: `/js${manifestFiles['vendors.js']}`,
    };

    const html = '';

    console.log('manifest', manifest);

    res.render('index', {html, state, ...manifest});
});

app.use(router);


const PORT = process.env.SERVER_PORT || 8084;

app.listen(PORT, function() {
    console.log('Production Express server running at localhost:' + PORT);
});

// console.log(process.env);
