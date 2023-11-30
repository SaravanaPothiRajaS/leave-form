
const fs = require('fs').promises;
var jwt = require('jsonwebtoken');
export default async (req, res) => {

    const { email } = req.body;
    console.log("email aaaa", email);

    try {
        const data = await fs.readFile('empData.json', 'utf8');
        let jsonData = JSON.parse(data);
        const filterData = jsonData.filter(val => val.email === email)
        if (filterData.length > 0) {
            res.json({ message: "ok" })
        }
        else {
            res.json({ message: "invalid" })

        }
        console.log("filterData", filterData);
        // console.log("json data aaaaa", jsonData);

    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}