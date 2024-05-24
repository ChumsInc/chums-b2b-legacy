exports.loadSlides = (req, res, next) => {
    http.get('http://localhost:8081/features/slides/active', (response) => {
        const {statusCode} = response;
        const contentType = response.headers['content-type'];

        let error;
        if (statusCode !== 200) {
            error = new Error('Request Failed.\n' +
                `Status Code: ${statusCode}`);
        } else if (!/^application\/json/.test(contentType)) {
            error = new Error('Invalid content-type.\n' +
                `Expected application/json but received ${contentType}`);
        }
        if (error) {
            console.error(error.message);
            // Consume response data to free up memory
            response.resume();
            return next();
        }

        response.setEncoding('utf8');
        let rawData = '';
        response.on('data', (chunk) => {
            rawData += chunk;
        });
        response.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                res.locals.slides = parsedData.slides || [];
                next();
            } catch (e) {
                console.error(e.message);
                res.locals.slides = [];
                next();
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        next();
    });
};
