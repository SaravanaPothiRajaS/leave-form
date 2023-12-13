import fs from 'fs/promises';
import authenticateToken from "../../app/middleware";
import transporter from '../../nodemail';
import logo from '../../app/images/raise1.png'
import { log } from 'console';
const AWS = require('aws-sdk');
 
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      authenticateToken(req, res, async (isAuthenticated) => {
        if (isAuthenticated) {

          const { email, department, role, name, total ,reason} = req.body;
          console.log(req.body);

          let fromEmail;
          let toEmail;

          
          AWS.config.update({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: process.env.REGION
          });
                 
              // Create an S3 object
          const s3 = new AWS.S3();
          
          // Specify the bucket and file key (path) of your JSON file
          const bucketName =  process.env.BUCKET_NAME;
          const fileKey = 'empData.json';
          
          // Create parameters for the S3 getObject operation
          const params = {
            Bucket: bucketName,
            Key: fileKey
          };
          
          // Fetch data from the JSON file in S3
          s3.getObject(params, async (err, data) => {
            if (err) {
              console.error('Error fetching data from S3:', err);
            } else {
              // Parse the JSON data
              const jsonData = JSON.parse(data.Body.toString('utf-8'));
           
            
          if (role === 'user') {
            fromEmail = email;
            const approverData = jsonData.find(
              (item) => item.role === 'approver' && item.department === department
            );
 
            if (approverData) {
              toEmail = approverData.email;
 
            }
          }

          if (role === 'approver') {
            fromEmail = email;
            const approverData = jsonData.find(
              (item) => item.role === 'admin');
            if (approverData) {
              toEmail = approverData.email;
 
            }
          }
  console.log(toEmail);
      await transporter.sendMail({
        to: toEmail,
        cc: fromEmail,
            subject: 'Compensatory Request',
            html: `
            <body style="position: relative; max-width: 600px; height: auto; margin: 0 auto; background: #ffffff;">
            <div>
              <!-- Heading -->
              <h1 style="position: relative; left: 7%; max-width: 85%; font-family: Recoleta; font-weight: bold; font-style: normal; font-size: min(10vw, 60px); line-height: 120%; color: #084243;">
                Compensatory Leave Request
              </h1>
            </div>
          
            <div>
              <!-- Paragraph -->
              <p style="position: relative; left: 7%; max-width: 85%; font-family: Raleway; font-style: normal; font-weight: 400; font-size: min(3vw, 16px); line-height: 160%; color: #084243;">
                Hello,<br>
                This is ${name} from ${department} department, and I would like to request compensatory leave for a number of days.
              </p>
          
              <!-- Leave Details -->
              <p style="position: relative; left: 7%; max-width: 85%; font-family: Raleway; font-style: normal; font-weight: 400; font-size: min(3vw, 16px); line-height: 160%; color: #084243;">
                <strong>Compensatory Leave Details:</strong>
                <br/> Name: ${name}
                <br/> Department: ${department}
                <br/> Compensatory Duration: ${total} ${total <= 1 ? 'day' : 'days'}
              </p>
          
              <!-- Additional Information -->
              <p style="position: relative; left: 7%; max-width: 85%; font-family: Raleway; font-style: normal; font-weight: 400; font-size: min(3vw, 16px); line-height: 160%; color: #084243;">
                Please consider my compensatory leave request and let me know if any additional information is required.
              </p>
          
              <!-- Thank You -->
              <p style="position: relative; left: 7%; max-width: 85%; font-family: Raleway; font-style: normal; font-weight: 400; font-size: min(3vw, 16px); line-height: 160%; color: #084243;">
                Thank you.
              </p>
            </div>
          
            <!-- Footer -->
            <div style="height: 150px; max-height: 25vw; position: relative; max-width: 600px; margin: 0 auto; background-color: #0c4243; border-radius: 40% 40% 0% 0%;">
              <!-- Footer Start -->
              <div style="float: left; margin-top: 10%; margin-left: 7%; max-width: 15%; padding: 0vw 0vw; position: absolute;">
                <!-- Raise Logo -->
                <a href="https://www.raisetech.io/">
                  <img style="max-height: min(15vw, 26px); max-width: min(15vw, 86px);" src="https://assets-global.website-files.com/622842ae2f5b915b1f257af9/622ad4bc8217517c4ac5abce_raise%20logo%20white.svg" height="100" width="300" alt="Logo">
                </a>
          
                <div style="margin-top: 5px; width: 150px; color: #FFFFFF;">
                  <!-- Raise Name -->
                  <a style="font-style: normal; font-weight: 200; font-family: Raleway; font-size: 15px; font-size: min(2.5vw, 15px); writing-mode: horizontal-tb; text-decoration: none; color: #FFFFFF;">raisetech.io</a>
                </div>
              </div>
          
              <div style="max-width: 30%; padding: 0vw 0vw; float: right; margin-top: 14%; margin-right: 7%;">
          
              </div>
              <!-- Footer End -->
            </div>
          </body>
          
    `,
          });
 
          res.status(200).json({ message: 'Email sent successfully' });

            }
          });









 
 
 
 
 
 
         
        } else {
          res.status(403).send('Forbidden: Invalid Token');
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}