const axios = require('axios');

const extractMeetingIdFromLink = (meetingLink) => {
  const regex = /\/j\/(\d+)/;
  const match = meetingLink.match(regex);
  if (match && match[1]) {
    return match[1];
  } else {
    throw new Error('Invalid meeting link');
  }
};

const ZoomClient = {
  joinMeeting: async (meetingLink) => {
    const meetingId = extractMeetingIdFromLink(meetingLink);

    try {
      // Call the Zoom API to join the meeting
      const response = await axios.post(`https://api.zoom.us/v2/meetings/${meetingId}/join`, {
        headers: {
          'Authorization': 'Bearer YOUR_ZOOM_API_TOKEN',
          'Content-Type': 'application/json'
        }
      });

      // Handle the response from the Zoom API
      if (response.status === 200) {
        // Meeting joined successfully
        console.log('Successfully joined the meeting');
      } else {
        // Failed to join the meeting
        console.error('Failed to join the meeting');
      }
    } catch (error) {
      console.error('An error occurred while joining the meeting:', error);
    }
  },
};

module.exports = ZoomClient;
