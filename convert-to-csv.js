const fs = require('fs');
const path = require('path');

// Replace with the path to your JSON file
const jsonFilePath = path.join(__dirname, 'output.json');
const audioFolderPath = path.join(__dirname, 'audio');
const audioFilePrefix = 'jeons-';

// Function to check if an audio file exists with the prefix
function audioFileExists(kanji) {
    const audioFilePath = path.join(audioFolderPath, `${audioFilePrefix}${kanji}.mp3`);
    return fs.existsSync(audioFilePath);
}

// Function to convert JSON to CSV
function jsonToCSV(jsonData) {
    // Map JSON data to CSV lines
    const csvLines = jsonData.map(entry => {
        const soundColumn = audioFileExists(entry.kanji) ? `[sound:${audioFilePrefix}${entry.kanji}.mp3]` : '';
        return `${entry.kanji},${entry.romaji},"${entry.english.replace(/"/g, '""')}","${soundColumn}"`;
    });

    // Combine lines
    return csvLines.join('\n');
}

// Reading the JSON file and converting to CSV
fs.readFile(jsonFilePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the JSON file:', err);
        return;
    }

    const jsonData = JSON.parse(data);
    const csvData = jsonToCSV(jsonData);

    // Writing the CSV to a file
    const csvFilePath = path.join(__dirname, 'output.csv');
    fs.writeFile(csvFilePath, csvData, 'utf8', (err) => {
        if (err) {
            console.error('Error writing the CSV file:', err);
            return;
        }
        console.log('CSV file has been created successfully');
    });
});
