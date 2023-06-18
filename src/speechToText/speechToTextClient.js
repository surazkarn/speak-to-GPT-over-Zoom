const speech = require('@google-cloud/speech');
const fs = require('fs');

// Set the path to your JSON key file
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'C:\\Users\\KIIT\\Desktop\\f\\speak to GPT over Zoom\\gptzoom-390211-e9517cb9a816.json';

const SpeechToTextClient = {
  convertAudioToText: async (audioData) => {
    // Configure the speech-to-text client
    const client = new speech.SpeechClient();

    try {
      // Specify the audio data
      const audio = {
        content: audioData,
      };

      // Configure the speech recognition request
      const config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      };

      const request = {
        audio: audio,
        config: config,
      };

      // Detect speech in the audio data
      const [response] = await client.recognize(request);

      // Retrieve the transcribed text
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      // Return the transcribed text
      return transcription;
    } catch (error) {
      console.error('An error occurred while converting audio to text:', error);
      throw error;
    }
  },
};

module.exports = SpeechToTextClient;
