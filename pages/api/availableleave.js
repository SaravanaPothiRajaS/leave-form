import authenticateToken from '../../app/middleware';
const AWS = require('aws-sdk');


export default async (req, res) => {
  try {
    authenticateToken(req, res, async (isAuthenticated) => {
      if (isAuthenticated) {

        const { email, availableLeave, totalDays, takenLeave, leaveType } = req.body;

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
        // Parse the JSON data
        
        if (leaveType === "Casual Leave") {
          const updatedData = jsonData.map(item => {
            if (item.email === email) {
              return { ...item, availableLeave: availableLeave - totalDays, takenLeave: takenLeave + Number(totalDays) };
            }
            return item;
          });

          const updatedJsonContent = JSON.stringify(updatedData, null, 2);

          // Upload the updated JSON content to S3
          const updateParams = {
            Bucket: bucketName,
            Key: fileKey,
            Body: updatedJsonContent,
            ContentType: 'application/json',
          };
  
          await s3.upload(updateParams).promise();
  
  
          res.json({ status: 200 });
        } else if (leaveType === "Compensatory Leave") {
          const updatedData = jsonData.map(item => {
            if (item.email === email) {
              return { ...item, compOffLeave: item.compOffLeave - totalDays, takenLeave: takenLeave + Number(totalDays) };
            }
            return item;
          });

          const updatedJsonContent = JSON.stringify(updatedData, null, 2);

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
          const updatedData = jsonData.map(item => {
            if (item.email === email) {
              return { ...item, takenLeave: takenLeave + Number(totalDays) };
            }
            return item;
          });

          const updatedJsonContent = JSON.stringify(updatedData, null, 2);

        // Upload the updated JSON content to S3
        const updateParams = {
          Bucket: bucketName,
          Key: fileKey,
          Body: updatedJsonContent,
          ContentType: 'application/json',
        };

        await s3.upload(updateParams).promise();


        res.json({ status: 200 });
        }

      } else {
        res.status(403).send('Forbidden: Invalid Token');
      }
    });

  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};