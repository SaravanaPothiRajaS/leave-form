import fs from 'fs/promises';

export default async (req, res) => {
    try {
        const data = await fs.readFile('holidayData.json', 'utf8');
        const jsonData = JSON.parse(data);
        const { id } = req.body;
        console.log(id);
        const indexToDelete = jsonData.findIndex(item => item.id === id);

        if (indexToDelete !== -1) {
            jsonData.splice(indexToDelete, 1);
            await fs.writeFile('holidayData.json', JSON.stringify(jsonData, null, 2));
            res.json(jsonData);
        } else {
            res.status(404).send('Data not found');
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
