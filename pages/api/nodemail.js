import authenticateToken from "../../app/middleware";
import transporter from "../../nodemail";
const AWS = require('aws-sdk');
 
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      authenticateToken(req, res, async (isAuthenticated) => {
        if (isAuthenticated) {
          const { name, status, email, fromEmail, department, total } = req.body;
 
          let toEmail;
          await transporter.sendMail({
            from: fromEmail,
            to: email,
            subject: 'Leave status',
 
            html: `
          <body style="position: relative; max-width: 600px; height: auto; margin: 0 auto; background: #ffffff;">
            <div>
              <!-- Heading -->
              <h1 style="position: relative; left: 7%; max-width: 85%; font-family: Recoleta; font-weight: bold; font-style: normal; font-size: min(10vw, 60px); line-height: 120%; color: #084243;">
                Leave Status
              </h1>
            </div>
        
            <div>
              <!-- Paragraph -->
              <p style="position: relative; left: 7%; max-width: 85%; font-family: Raleway; font-style: normal; font-weight: 400; font-size: min(3vw, 16px); line-height: 160%; color: #084243;">
                Dear ${name},
                <br/> Your request for leave is ${status}. We have reviewed your request, and the current status is as follows:
              </p>
        
              <!-- Leave Details -->
              <p style="position: relative; left: 7%; max-width: 85%; font-family: Raleway; font-style: normal; font-weight: 400; font-size: min(3vw, 16px); line-height: 160%; color: #084243;">
                <strong>Leave Details:</strong>
                <br/> Name: ${name}
                <br/> Department: ${department}
                <br/> Leave Duration: ${total}
              </p>
        
              <!-- Additional Information -->
              <p style="position: relative; left: 7%; max-width: 85%; font-family: Raleway; font-style: normal; font-weight: 400; font-size: min(3vw, 16px); line-height: 160%; color: #084243;">
                If you have any questions or need further clarification, please feel free to contact.
              </p>
        
              <!-- Thank You -->
              <p style="position: relative; left: 7%; max-width: 85%; font-family: Raleway; font-style: normal; font-weight: 400; font-size: min(3vw, 16px); line-height: 160%; color: #084243;">
                Thank you for your understanding.
              </p>
            </div>
        
            <!-- Footer -->
            <div style="height: 150px; max-height: 25vw; position: relative; max-width: 600px; margin: 0 auto; background-color: #0c4243; border-radius: 40% 40% 0% 0%;">
              <!-- Footer Start -->
              <div style="float: left; margin-top: 10%; margin-left: 7%; max-width: 15%; padding: 0vw 0vw; position: absolute;">
                <!-- Raise Logo -->
                <a href="https://www.raisetech.io/">
                  <img style="max-height: min(15vw, 26px); max-width: min(15vw, 86px);" src="cid:emailTempLogoWhite" height="26" width="86">
                </a>
        
                <div style="margin-top: 5px; width: 150px; color: #FFFFFF;">
                  <!-- Raise Name -->
                  <a style="font-style: normal; font-weight: 200; font-family: Raleway; font-size: 15px; font-size: min(2.5vw, 15px); writing-mode: horizontal-tb; text-decoration: none; color: #FFFFFF;">raisetech.io</a>
                </div>
              </div>
        
              <div style="max-width: 30%; padding: 0vw 0vw; float: right; margin-top: 14%; margin-right: 7%;">
                <div style="display: inline-block; margin-right: 8px;">
                  <!-- Twitter Logo -->
                  <a href="https://twitter.com/raisetechio">
                    <img style="max-height: min(3vw, 16px); max-width: min(15vw, 18px); color: #1DA1F2;" src="cid:emailTempTwitter" height="16" width="18">
                  </a>
                </div>
        
                <div style="display: inline-block; margin-right: 8px;">
                  <!-- Facebook Logo -->
                  <a href="https://www.facebook.com/raisetechio">
                    <img style="max-height: min(3vw, 16px); max-width: min(15vw, 13px); color: #1877F2;" src="cid:emailTempFacebook" height="16" width="13">
                  </a>
                </div>
        
                <div style="display: inline-block;">
                  <!-- LinkedIn Logo -->
                  <a href="https://www.linkedin.com/company/raisetechio/">
                    <img style="max-height: min(3vw, 16px); max-width: min(15vw, 18px); color: #0A66C2;" src="cid:emailTempLinkedin" height="16" width="18">
                  </a>
                </div>
              </div>
              <!-- Footer End -->
            </div>
          </body>
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