// Test script for admin persona in floating chat
const testMessage = {
  message: "Halo, siapa kamu?",
  sessionId: "test-floating-chat"
};

console.log('🧪 Testing floating chat with admin persona...');
console.log('Message:', testMessage.message);
console.log('');

fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testMessage)
})
.then(response => response.json())
.then(data => {
  console.log('✅ Response received:');
  console.log('Persona:', data.persona);
  console.log('Response:', data.response);
  console.log('Session ID:', data.sessionId);
  console.log('Processing Time:', data.processingTime, 'ms');
  console.log('');

  if (data.persona && data.persona.name) {
    console.log(`🎯 Admin persona "${data.persona.name}" is working correctly!`);
  } else {
    console.log('⚠️ No persona detected in response');
  }
})
.catch(error => {
  console.error('❌ Error testing chat:', error);
});