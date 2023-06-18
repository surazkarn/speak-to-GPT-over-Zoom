document.addEventListener('DOMContentLoaded', () => {
    const zoomForm = document.getElementById('zoomForm');
  
    zoomForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const meetingLink = document.getElementById('meetingLink').value;
      joinZoomMeeting(meetingLink);
    });
  
    async function joinZoomMeeting(meetingLink) {
      try {
        const response = await fetch('/join-meeting', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ meetingLink })
        });
  
        if (response.ok) {
          console.log('Successfully joined the Zoom meeting');
          // Handle success (e.g., show a success message to the user)
        } else {
          console.error('Failed to join the Zoom meeting');
          // Handle failure (e.g., show an error message to the user)
        }
      } catch (error) {
        console.error('Error while joining the Zoom meeting:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  });
  