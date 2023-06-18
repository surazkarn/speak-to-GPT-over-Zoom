const axios = require('axios');

const GptClient = {
  generateGptResponse: async (text) => {
    try {
      // Make a POST request to the GPT-3 API endpoint
      const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
        prompt: text,
        max_tokens: 50, // Adjust the desired length of the response
        temperature: 0.7, // Adjust the temperature for response randomness
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_OPENAI_API_KEY',
        },
      });

      // Handle the response from the GPT-3 API
      if (response.status === 200) {
        const gptResponse = response.data.choices[0].text.trim();
        return gptResponse;
      } else {
        console.error('Failed to generate GPT response');
        return null;
      }
    } catch (error) {
      console.error('An error occurred while generating GPT response:', error);
      return null;
    }
  },
};

module.exports = GptClient;
