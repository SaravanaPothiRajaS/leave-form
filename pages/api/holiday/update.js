

import authenticateToken from '@/app/middleware';
import fs from 'fs/promises';

export default async (req, res) => {
    try {
        authenticateToken(req, res, async(isAuthenticated) => {
            if (isAuthenticated) {
        const data = await fs.readFile('holidayData.json', 'utf8');
        const jsonData = JSON.parse(data);

        const { changevalue } = req.body;
        console.log(changevalue.id);

        // Find the holiday to update based on the date
        const holidayToUpdateIndex = jsonData.findIndex(holiday => holiday.id === changevalue.id);

        if (holidayToUpdateIndex === -1) {
            res.status(400).send('Holiday not found');
            return;
        }

        // Update the holiday with the new changevalue
        jsonData[holidayToUpdateIndex] = {
            ...jsonData[holidayToUpdateIndex],
            ...changevalue
        };

        await fs.writeFile('holidayData.json', JSON.stringify(jsonData, null, 2));
        res.status(200);
    } else {
        res.status(403).send('Forbidden: Invalid Token');
      }
    });

    } catch (error) {
        console.error('Error updating holiday:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

