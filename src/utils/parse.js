const StreamZip = require('node-stream-zip');

module.exports = {
    open: filePath => {
        return new Promise((resolve, reject) => {
            const zip = new StreamZip({
                file: filePath,
                storeEntries: true
            });

            zip.on('ready', () => {
                let chunks = [];

                zip.stream('word/document.xml', (error, stream) => {
                    if (error) {
                        reject(error);
                    }
                    
                    stream.on('data', chunk => {
                        chunks.push(chunk)
                    });

                    stream.on('end', () => {
                        zip.close()
                        resolve(Buffer.concat(chunks).toString())
                    });
                });
            });
        });
    },
    extract: filePath => {
        return new Promise((resolve, reject) => {
            module.exports.open(filePath).then((response, error) => {
                if (error) {
                    reject(error);
                }

                const data = response
                    .match(/<w:t>(.*?)<\/w:t>/g, ' ')
                    .map(content => content.replace(/<[^>]*>?/gm, ''))

                resolve({
                    data: {
                        title: data[0],
                        salaryTo: data[1].replace(' per annum', ''),
                        salaryFrom: data[1].replace(' per annum', ''),
                        contractType: data[2].split(',')[0],
                        employmentHours: data[2].split(',')[1].replace(' ', ''),
                        town: data[3].split(',')[0].replace(' ', ''),
                        country: data[3].split(',')[1].replace(' ', ''),
                        postcode: null,
                        skills: ['Web Development', 'React', 'React Native', 'GraphQL', 'Redux', 'DDD Principles', 'Microservices'],
                        description: require('./html')
                    }
                });
            });
        });
    }
};