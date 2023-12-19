const fs = require('fs');
const path = require('path');

// Replace with the path to your JSON file
const jsonFilePath = path.join(__dirname, 'output.json');

// Function to convert JSON to CSV
function jsonToCSV(jsonData) {
    // Create the CSV header
    const header = 'Kanji,Romaji,English\n';

    // Map JSON data to CSV lines
    const csvLines = jsonData.map(entry =>
        `${entry.kanji},${entry.romaji},"${entry.english.replace(/"/g, '""')}"` // Handle quotes in English descriptions
    );

    // Combine header and lines
    return header + csvLines.join('\n');
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
