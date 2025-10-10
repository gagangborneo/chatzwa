const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3000,
  path: '/api/health',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`Healthcheck status: ${res.statusCode}`);
  
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', (err) => {
  console.error('Healthcheck failed:', err.message);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Healthcheck timeout');
  req.destroy();
  process.exit(1);
});

req.end();