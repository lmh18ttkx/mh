import express from 'express';
import mysql from 'mysql2/promise';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

// file name and path declaration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//initialize express app
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));    

//Mysql database connection
const db = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mh18ttkx',
  database: 'weatherdb'
});

//Create the table to store weather information
await db.query(`
  CREATE TABLE IF NOT EXISTS weather_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    temperature FLOAT NOT NULL,
    description VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
  )`);

  //API endpoint
const API_KEY = '4df4c74c9856144652f1427846273f90'; // Replace with your actual API key
app.get('/weather', async (req, res) => {
    //read the data from weather API
    const city = req.query.city;
    const apiurl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    try {
        const response = await fetch(apiurl);
        const data = await response.json();
        if(data.cod !== 200) {
            return res.status(404).json({ error: 'City not found' });
        }
        const result = {
            city: data.name,
            country: data.sys.country,
            temperature: data.main.temp,
            description: data.weather[0].description
        };

        await db.execute(
            'INSERT INTO weather_data (city, country, temperature, description) VALUES (?, ?, ?, ?)',
            [result.city, result.country, result.temperature, result.description]
        );
        
        return res.json(result);
    }   catch(error) {
            console.error('Error fetching weather data:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    //Insert the data into weather_data table
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });