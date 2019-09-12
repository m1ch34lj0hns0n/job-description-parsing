const express = require('express');
const parse = require('./utils/parse');
const storage = require('./utils/storage');

const app = express();

app.post('/', storage.checkStorageDirExists, (request, response) => {
    storage.uploadDocument(request, response, error => {
        if (error) {
            response.status(500).json(error);
        }

        const file = storage.filePath(request.file.filename);

        parse.extract(file)
            .then(data => response.status(200).json(data))
            .catch(error => response.status(500).json(error));
    });
});

app.listen(4000, () => {
    console.log('Listening on localhost:4000');
});