const express = require('express');
const path = require('path');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Serve the static HTML file
app.use(express.static(path.join(__dirname, '')));  // Serve index.html from the root

// Start bots endpoint
app.post('/start-bots', async (req, res) => {
    const { targetUrl, botCount } = req.body;

    if (!targetUrl || !botCount) {
        return res.status(400).json({ message: 'Target URL and bot count are required.' });
    }

    try {
        const browser = await puppeteer.launch();
        const promises = [];

        // Launch bots (simulate browser activity)
        for (let i = 0; i < botCount; i++) {
            promises.push(async () => {
                const page = await browser.newPage();
                await page.goto(targetUrl);
                // You can add more actions here (e.g., clicking, scrolling, etc.)
                await page.close();
            });
        }

        // Run the bot simulations
        await Promise.all(promises.map(fn => fn()));

        await browser.close();
        res.json({ message: `${botCount} bots have been simulated on ${targetUrl}` });
    } catch (error) {
        console.error('Error starting bots:', error);
        res.status(500).json({ message: 'An error occurred while simulating bots.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
