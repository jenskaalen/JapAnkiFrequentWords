require('dotenv').config(); // Load environment variables from .env file

const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const util = require('util');
const path = require('path');

// Ensure the environment variable is set
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error('The GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.');
}

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

// Function to synthesize speech
async function synthesizeSpeech(text, outputFile) {
  const request = {
    input: { text: text },
    voice: { languageCode: 'ja-JP', name: 'ja-JP-Neural2-B' },
    audioConfig: { audioEncoding: 'MP3' },
  };

  const [response] = await client.synthesizeSpeech(request);
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(outputFile, response.audioContent, 'binary');
  console.log(`Audio content written to file: ${outputFile}`);
}

// Function to process range and synthesize speech for each entry
async function processRange(jsonData, start, end) {
  const audioDir = path.join(__dirname, 'audio');
  if (!fs.existsSync(audioDir)){
    fs.mkdirSync(audioDir);
  }

  for (let i = start - 1; i < end && i < jsonData.length; i++) {
    const entry = jsonData[i];
    const outputFile = path.join(audioDir, `${entry.kanji}.mp3`);
    await synthesizeSpeech(entry.kanji, outputFile);
  }
}

// Reading the JSON file and processing the specified range
const jsonFilePath = path.join(__dirname, 'output.json');
fs.readFile(jsonFilePath, 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading the JSON file:', err);
        return;
    }

    const jsonData = JSON.parse(data);
    const startRange = 1; // Set your start range here
    const endRange = 20; // Set your end range here
    await processRange(jsonData, startRange, endRange);
});
