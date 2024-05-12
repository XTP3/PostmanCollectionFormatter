const fs = require('fs');

const filename = process.argv[2];

function extractItemInfo(item) {
    const request = item.request;

    const headerKey = request.header.length > 0 ? `Header Key: ${request.header[0].key}` : '';
    const method = `Method: ${request.method}`;

    let bodyKeys = '';
    if(request.body.mode === 'raw') {
        const body = JSON.parse(request.body.raw);
        const keys = Object.keys(body);
        if(keys.length > 0) {
            bodyKeys = `Accepted Fields: ${keys.join(', ')}`;
        }
    }

    const path = `Path: ${request.url.path.join('/')}\n`;

    return [
        `Name: ${item.name}`,
        method,
        headerKey,
        bodyKeys,
        path,
        ''
    ].filter(Boolean);
}

fs.readFile(filename, (err, data) => {
    if(err) {
        console.error(err);
        return;
    }

    const items = JSON.parse(data.toString()).item;
    const output = items.flatMap(extractItemInfo);

    const outputStream = fs.createWriteStream(filename.split('.')[0] + '.txt');
    outputStream.write(output.join('\n'));
    outputStream.end();
});
