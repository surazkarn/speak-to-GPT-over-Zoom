const axios = require('axios');

const TextToSpeechClient = {
  convertTextToSpeech: async (text) => {
    try {
      // Make a GET request to the Google Text-to-Speech API
      const response = await axios.get(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(text)}`, {
        responseType: 'arraybuffer',
      });

      // Handle the response from the Text-to-Speech API
      if (response.status === 200) {
        return response.data;
      } else {
        console.error('Failed to convert text to speech');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while converting text to speech:', error);
      return null;
    }
  },
};

module.exports = TextToSpeechClient;
