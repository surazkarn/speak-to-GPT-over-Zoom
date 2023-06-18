const express = require('express');
const axios = require('axios');
const app = express();
const record = require('node-mic-record');
const player = require('play-sound')();

app.use(express.static('public'));
app.use(express.json());

const zoomClient = require('./zoom/zoomClient');
const speechToTextClient = require('./speechToText/speechToTextClient');
const gptClient = require('./gpt/gptClient');
const textToSpeechClient = require('./textToSpeech/textToSpeechClient');

const CLIENT_ID = 'jScBqDIETmmgRSMSuAMLAw';
const CLIENT_SECRET = 'OEf6TmO5CFsB4uBj8ZrDgIPK9MpDKl4a';
const REDIRECT_URI = 'http://localhost:3000/zoom/callback';
const SCOPE = 'meeting:write';

let accessToken = '';

app.get('/join-meeting', (req, res) => {
  const authorizeUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
  res.redirect(authorizeUrl);
});

app.get('/zoom/callback', async (req, res) => {
  const authorizationCode = req.query.code;

  try {
    const tokenResponse = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    });

    accessToken = tokenResponse.data.access_token;

    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to exchange authorization code for access token:', error);
    res.sendStatus(500);
  }
});

app.post('/join-meeting', async (req, res) => {
  const meetingLink = req.body.meetingLink;

  // Validate the meeting link
  if (!isValidMeetingLink(meetingLink)) {
    return res.status(400).json({ error: 'Invalid meeting link' });
  }

  try {
    // Join the Zoom meeting
    await zoomClient.joinMeeting(meetingLink, accessToken);
    console.log('Successfully joined the Zoom meeting');

    // Start listening for audio input
    const audioData = await listenForAudioInput();
    console.log('Received audio input');

    // Convert audio to text
    const text = await speechToTextClient.convertAudioToText(audioData);
    console.log('Transcribed text:', text);

    // Generate response using GPT
    const response = await gptClient.generateGptResponse(text);
    console.log('Generated GPT response:', response);

    // Convert response text to speech
    const audioResponse = await textToSpeechClient.convertTextToSpeech(response);
    console.log('Converted response to audio');

    // Play the audio response in the Zoom meeting
    await playAudioResponse(audioResponse);
    console.log('Played the audio response in the Zoom meeting');

    return res.sendStatus(200);
  } catch (error) {
    console.error('An error occurred:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

function isValidMeetingLink(meetingLink) {
  const zoomMeetingLinkPattern = /^https:\/\/[a-z0-9-]+\.zoom\.us\/j\/\d+\?pwd=[a-zA-Z0-9_-]+$/;
  return zoomMeetingLinkPattern.test(meetingLink);
}

// ...

function listenForAudioInput() {
  return new Promise((resolve, reject) => {
    const audioChunks = [];

    const recorder = record.start({
      sampleRate: 16000,
      verbose: false,
      recorder: '',
      device: null, // Use the default audio input device
    });

    recorder.on('data', (chunk) => {
      audioChunks.push(chunk);
    });

    setTimeout(() => {
      record.stop(); // Stop the recording by calling `record.stop()` instead
    }, 5000); // Adjust the duration as needed

    recorder.on('end', () => {
      const audioData = Buffer.concat(audioChunks);
      resolve(audioData);
    });
  });
}

// ...



function playAudioResponse(audioData) {
  return new Promise((resolve, reject) => {
    const filePath = 'response_audio.wav';

    require('fs').writeFileSync(filePath, audioData);

    player.play(filePath, (error) => {
      if (error) {
        console.error('Error playing audio response:', error);
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
