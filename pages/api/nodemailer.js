import fs from 'fs/promises';
import authenticateToken from "../../app/middleware";
import transporter from '../../nodemail';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      authenticateToken(req, res, async (isAuthenticated) => {
        if (isAuthenticated) {
          const data = await fs.readFile('empData.json', 'utf8');
          const jsonData = JSON.parse(data);
          const { email, department, role, name } = req.body;
          let fromEmail;
          let toEmail;
          console.log(req.body);


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




          await transporter.sendMail({
            from: fromEmail,
            to: toEmail,
            bcc: 'vinodhkumaryin@gmail.com',
            subject: 'Leave Request',
            text: `
          Leave Request
          Hello,
          I, ${name} from the ${department} department, would like to request a leave for a number of days.
          Leave Details:
          Name: ${name}
          Department: ${department}
          Leave Duration: Two days
          Please consider my leave request and let me know if any additional information is required.
          Thank you.
        `,
          });

          res.status(200).json({ message: 'Email sent successfully' });
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