const fs = require('fs');
const path = require('path');

// Replace with the path to your file
const filePath = path.join(__dirname, 'words.txt');

// Function to process each line into the desired format
function processLine(line) {
    const parts = line.split(' ');
    return {
        kanji: parts[0],
        romaji: parts[1],
        english: parts.slice(3).join(' ').replace(/:/g, '').trim()
    };
}

// Reading and processing the file
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const lines = data.split('\n');
    const result = lines
        .filter(line => line.trim().length > 0) // Filter out empty lines
        .map(line => processLine(line))
        .filter(entry => entry.kanji); // Additional check for entry validity

    // Writing the JSON output to a file
    const outputFilePath = path.join(__dirname, 'output.json');
    fs.writeFile(outputFilePath, JSON.stringify(result, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing the JSON file:', err);
            return;
        }
        console.log('JSON file has been created successfully');
    });
});