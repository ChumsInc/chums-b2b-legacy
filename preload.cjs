const {loadJSON} = require('./load-content');
const debug = require('debug')('chums:preload');

exports.preload = (req, res, next) => {
    loadJSON('http://localhost:8081/preload/state')
        .then(state => {
            res.locals = {...res.locals, ...state};
            next();
        })
        .catch(err => {
            debug('preload()', err.name, err.message);
            next();
        });
};


exports.loadChumsMenu = (req, res, next) => {
    loadJSON('http://localhost:8081/menus/2')
        .then(({menus = []}) => {
            res.locals.menu_chums = menus[0] || {};
            next();
        })
        .catch(err => {
            debug('loadChumsMenu()', err.name, err.message);
            res.locals.menu_chums = [];
            next();
        });
};

exports.loadBCMenu = (req, res, next) => {
    loadJSON('http://localhost:8081/menus/118')
        .then(({menus = []}) => {
            res.locals.menu_bc = menus[0] || {};
            next();
        })
        .catch(err => {
            debug('loadBCMenu()', err.name, err.message);
            res.locals.menu_bc = [];
            next();
        });
};

exports.loadSlides = (req, res, next) => {
    loadJSON('http://localhost:8081/features/slides/active')
        .then(({slides = []}) => {
            res.locals.slides = slides;
            next();
        })
        .catch(err => {
            debug('loadSlides()', err.name, err.message);
            res.locals.slides = [];
            next();
        });
};

exports.loadKeywords = (req, res, next) => {
    loadJSON('http://localhost:8081/keywords')
        .then(({result}) => {
            res.locals.keywords = result || [];
            next();
        })
        .catch(err => {
            debug('loadKeywords()', err.name, err.message);
            res.locals.keywords = [];
            next();
        });
}
