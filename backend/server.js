// filepath: backend/server.js
const express = require('express');
const app = express();
const port = 5000;

app.get('/api', (req, res) => {
  res.send('Hello from the backend!');
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});