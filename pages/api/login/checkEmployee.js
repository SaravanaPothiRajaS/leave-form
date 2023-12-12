
const fs = require('fs').promises;
var jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');

export default async (req, res) => {

    const { email } = req.body;
    AWS.config.update({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.REGION,
      });

      // Create an S3 object
      const s3 = new AWS.S3();

      // Specify the bucket and file key (path) of your JSON file
      const bucketName = process.env.BUCKET_NAME;
      const fileKey = 'empData.json';

      // Fetch data from the JSON file in S3
      const data = await s3.getObject({ Bucket: bucketName, Key: fileKey }).promise();
      const jsonData = JSON.parse(data.Body.toString('utf-8'));

    try {
      
        const filterData = jsonData.filter(val => val.email === email)
        if (filterData.length > 0) {
            res.json({ message: "ok" })
        }
        else {
            res.json({ message: "invalid" })

        }
        // console.log("json data aaaaa", jsonData);

    }
    catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}