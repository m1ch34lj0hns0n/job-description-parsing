const fs = require('fs');
const path = require('path');
const multer = require('multer');

const filePath = path.join(__dirname, '../storage');

module.exports = {
    checkStorageDirExists: (request, response, next) => {
        if (fs.existsSync(filePath)) {
            next();
        } else {
            fs.mkdir(filePath, error => {
                error ? response.status(500).json(error) : next();
            });
        }
    },
    filePath: fileName => {
        return `${filePath}\\${fileName}`;
    },
    deleteDocument: file => {
        try {
            fs.unlinkSync(`${filePath}/${file}`);
        } catch(error) {
            console.log(error);
        }
    },
    uploadDocument: multer({
        storage: multer.diskStorage({
            destination: function (request, file, callback) {
                callback(null, filePath);
            },
            filename: function (request, file, callback) {
                callback(null, `${file.fieldname}-${Date.now()}.docx`);
            }
        }),
        fileFilter: (request, file, callback) => {
            if (!file.originalname.match(/^.*\.(docx)$/gi)) {
                return callback(new Error('We are unable to parse this file type'));
            }
            callback(null, true);
        },
        limits: {
            fileSize: (1024 * 1024) * 5
        },
    }).single('description')
};