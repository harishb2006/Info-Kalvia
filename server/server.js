const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// 2. Global Middleware
app.use(cors());
app.use(express.json()); 
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
 




app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server Active', timestamp: new Date() });
});