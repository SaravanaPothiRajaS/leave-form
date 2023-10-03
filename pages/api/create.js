const fs = require('fs').promises;


export default async (req, res) => {
  try {
    const data = await fs.readFile('statusData.json', 'utf8');
    const jsonData = JSON.parse(data);
    const {addValue}=req.body;
    
    console.log(addValue);
        jsonData.push(addValue);

        await fs.writeFile('statusData.json', JSON.stringify(jsonData, null, 2));
        res.json(jsonData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};