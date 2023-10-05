const fs = require('fs').promises;

export default async (req, res) => {
  try {
    const data = await fs.readFile('empData.json', 'utf8');
    let jsonData = JSON.parse(data);
    const { email, availableLeave,totalDays ,takenLeave} = req.body;
    // const personToUpdate = jsonData.find(person => person.email=== email);
    // if (!personToUpdate) {
    //     res.status(400).send('Person not found');
    //     return;
    // }

    const updatedData = jsonData.map(item => {
        if (item.email === email) {
          // Clone the object and update the 'age' field
          return { ...item, availableLeave: availableLeave - totalDays,takenLeave: takenLeave + Number(totalDays) };
        }
        return item; // For other items, return them unchanged
      });


    // if (availableLeave) {
    //   personToUpdate.availableLeave = availableLeave;
    // }
jsonData = updatedData;
        await fs.writeFile('empData.json', JSON.stringify(jsonData, null, 2));
        res.json(jsonData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};