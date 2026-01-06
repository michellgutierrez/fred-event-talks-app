const express = require('express');
const path = require('path');
const { generateSchedule } = require('./utils/scheduleGenerator');
const mockTalks = require('./data/talks');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to get the schedule
app.get('/api/schedule', (req, res) => {
    const categoryFilter = req.query.category;
    try {
        const schedule = generateSchedule(mockTalks, '10:00 AM', 60, 10); // Start 10 AM, 60 min lunch, 10 min transition
        let filteredSchedule = schedule;

        if (categoryFilter) {
            const lowerCaseFilter = categoryFilter.toLowerCase();
            filteredSchedule = schedule.map(item => {
                if (item.type === 'talk') {
                    const talkCategories = item.category.map(cat => cat.toLowerCase());
                    if (talkCategories.some(cat => cat.includes(lowerCaseFilter))) {
                        return item;
                    }
                } else {
                    return item; // Always include breaks
                }
                return null;
            }).filter(item => item !== null);
        }
        res.json(filteredSchedule);
    } catch (error) {
        console.error('Error generating schedule:', error);
        res.status(500).json({ error: 'Failed to generate schedule' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});