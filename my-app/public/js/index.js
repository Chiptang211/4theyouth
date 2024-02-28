async function fetchStaffInfo() {
    const response = await fetch('https://info442.chiptang.com/lookup/staff/info?staffId=all');
    if (!response.ok) {
      throw new Error('Failed to fetch staff info');
    }
    return response.json();
  }
  
  async function fetchBulletinMessages() {
    const response = await fetch('https://info442.chiptang.com/lookup/bulletin?staffId=all');
    if (!response.ok) {
      throw new Error('Failed to fetch bulletin messages');
    }
    return response.json();
  }
  
  async function displayBulletinWithStaffNames() {
    try {
      const [staffInfo, bulletinMessages] = await Promise.all([fetchStaffInfo(), fetchBulletinMessages()]);

      // Convert staff info array to a map for easy lookup
      const staffMap = new Map(staffInfo.map(staff => [staff.staff_id, staff.name]));
      
      // Clear existing content
      const bulletinSection = document.getElementById('bulletin');
      bulletinSection.innerHTML = '';
      
      // Create and append bulletin messages with staff names
      bulletinMessages.forEach(message => {
        const staffName = staffMap.get(message.staff_id) || 'Unknown Staff';
        const messageElement = document.createElement('div');
        messageElement.className = 'info-div';
        messageElement.innerHTML = `
          <strong>${staffName} </strong> (ID ${message.staff_id})<br>
          ${message.message}<br>
        `;
        bulletinSection.appendChild(messageElement);
      });
    } catch (error) {
      console.error('Failed to display bulletin messages:', error);
      document.getElementById('bulletin').innerText = 'Failed to load bulletin messages.';
    }
  }
  
  // Call the function to display bulletins with staff names on page load
  document.addEventListener('DOMContentLoaded', displayBulletinWithStaffNames);