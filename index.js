const express = require('express');
require('dotenv').config();

const cors= require('cors');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
  res.send('Hello From Diva Eyeshadow Palette!')
})

app.listen(port, () => {
  console.log('Running Diva Eyshadow Palette Server on port' , port);
})