import fs from 'fs/promises';
import authenticateToken from '../../../app/middleware';
const AWS = require('aws-sdk');

export default async (req, res) => {
  try {
    authenticateToken(req, res, async (isAuthenticated) => {
      if (isAuthenticated) {
        // Configure AWS SDK
        AWS.config.update({
          accessKeyId: process.env.ACCESS_KEY_ID,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
          region: process.env.REGION,
        });

        // Create an S3 object
        const s3 = new AWS.S3();

        // Specify the bucket and file key (path) of your JSON file
        const bucketName = process.env.BUCKET_NAME;
        const fileKey = 'holidayData.json';

        // Fetch data from the JSON file in S3
        const data = await s3.getObject({ Bucket: bucketName, Key: fileKey }).promise();

        // Parse the JSON data
        const jsonData = JSON.parse(data.Body.toString('utf-8'));

        const { id } = req.body;

        // Find the index of the object to delete based on the ID
        const objectToDeleteIndex = jsonData.findIndex((obj) => obj.id === id);

        if (objectToDeleteIndex === -1) {
          res.status(400).send('Object not found');
          return;
        }

        // Remove the object from the array
        jsonData.splice(objectToDeleteIndex, 1);

        // Convert the updated JSON content to a string
        const updatedJsonContent = JSON.stringify(jsonData, null, 2);

        // Upload the updated JSON content to S3
        const updateParams = {
          Bucket: bucketName,
          Key: fileKey,
          Body: updatedJsonContent,
          ContentType: 'application/json',
        };

        await s3.upload(updateParams).promise();


        res.json({ status: 200 });
      } else {
        res.status(403).send('Forbidden: Invalid Token');
      }
    });
  } catch (error) {
    console.error('Error deleting object:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
