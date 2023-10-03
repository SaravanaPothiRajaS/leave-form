const fs = require('fs').promises;
export default async (req, res) => {
  try {
    const data = await fs.readFile('data.json', 'utf8');
        const jsonData = JSON.parse(data);

        const idToDelete = req.query.id;
        const indexToDelete = jsonData.findIndex(item => item.id == idToDelete);

        if (indexToDelete !== -1) {
            jsonData.splice(indexToDelete, 1); 
            await fs.writeFile('data.json', JSON.stringify(jsonData, null, 2));
            res.json(jsonData);
        } else {
            res.status(404).send('Data not found');
        }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};