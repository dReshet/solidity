const fs = require('fs');

console.log('Hello NodeJs');

const handleReadFile = (error, data) => {
    if (error) {
        console.log(error, 'error');
        return
    }
    console.log(data);
}

fs.readFile('./poem.txt', 'utf8', handleReadFile)
const data = fs.readFileSync('./year.txt', 'utf-8');

console.log(data);