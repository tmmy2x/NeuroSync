const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('NeuroSync API is running 🎯');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
