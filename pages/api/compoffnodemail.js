import authenticateToken from "../../app/middleware";
import transporter from "../../nodemail";
const AWS = require('aws-sdk');
 
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      authenticateToken(req, res, async (isAuthenticated) => {
        if (isAuthenticated) {
          const { name, status, email, fromEmail, department, total } = req.body;
 
          console.log(fromEmail,email,"test");
          
          await transporter.sendMail({
            cc:fromEmail,
            to: email,
            subject: 'Compensatory status',
 
            html: `
            <body style="position: relative; max-width: 600px; height: auto; margin: 0 auto; background: #ffffff;">
            <div>
                <!-- Heading -->
                <h1 style="position: relative; left: 7%; max-width: 85%; font-family: Recoleta; font-weight: bold; font-style: normal; font-size: min(10vw, 60px); line-height: 120%; color: #084243;">
                    Compensatory Status 
                </h1>
            </div>
        
            <div>
                <!-- Paragraphs -->
                <p style="position: relative; left: 7%; max-width: 85%; font-family: Raleway; font-style: normal; font-weight: 400; font-size: min(3vw, 16px); line-height: 160%; color: #084243;">
                    Dear ${name},
                    <br/> Your compensatory request has been ${status}. We have reviewed your request.
                </p>
        
                <!-- Additional Information -->
                <p style="position: relative; left: 7%; max-width: 85%; font-family: Raleway; font-style: normal; font-weight: 400; font-size: min(3vw, 16px); line-height: 160%; color: #084243;">
                    If you have any questions or need further clarification, please feel free to contact us.
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
                        <img style="max-height: min(15vw, 26px); max-width: min(15vw, 86px);" src="https://assets-global.website-files.com/622842ae2f5b915b1f257af9/622ad4bc8217517c4ac5abce_raise%20logo%20white.svg" height="26" width="86">
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