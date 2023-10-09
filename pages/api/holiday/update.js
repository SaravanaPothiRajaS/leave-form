

import fs from 'fs/promises';

export default async (req, res) => {
    try {
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

    } catch (error) {
        console.error('Error updating holiday:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// const fs = require('fs').promises;


// export default async (req, res) => {

//     try {
//         const data = await fs.readFile('holidayData.json', 'utf8');
//         const jsonData = JSON.parse(data);
//         const { changevalue } = req.body;
//         // console.log(req.body);
//         // console.log(changevalue);
//         console.log(jsonData);
//         const holidayToUpdate = jsonData.find(holiday => holiday.date === changevalue.date);

//         console.log(holidayToUpdate);
//         if (!holidayToUpdate) {
//             res.status(400).send('Person not found');
//             return;
//         }


//         if (changevalue) {
//             holidayToUpdate.status = changevalue;
//         }

//         await fs.writeFile('statusData.json', JSON.stringify(jsonData, null, 2));
//         res.json(jsonData);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
