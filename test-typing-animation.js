// Test script to check typing animation in floating chat
const testMessage = {
  message: "Test animasi typing dots",
  sessionId: "test-typing-animation"
};

console.log('🧪 Testing typing animation...');
console.log('Sending message to trigger loading state...');
console.log('');

// Start the request
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
  console.log('- Persona:', data.persona.name);
  console.log('- Response length:', data.response.length, 'characters');
  console.log('- Processing time:', data.processingTime, 'ms');
  console.log('');
  console.log('💡 During the processing time, you should see 3 animated dots in the floating chat!');
  console.log('   The dots should bounce up and down with a staggered animation.');
})
.catch(error => {
  console.error('❌ Error testing chat:', error);
});

console.log('⏳ Request sent, check the floating chat for animated typing dots...');