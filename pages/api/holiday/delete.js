import fs from 'fs/promises';
import authenticateToken from '../../../app/middleware';

export default async (req, res) => {
    try {
        authenticateToken(req, res, async (isAuthenticated) => {
            if (isAuthenticated) {
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
            } else {
                res.status(403).send('Forbidden: Invalid Token');
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
