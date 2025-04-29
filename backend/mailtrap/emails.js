import { VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email verification",
    });

    console.log("Email sent successsfully", response);
  } catch (error) {
    console.error(`Error sending verification`, error);
    throw new Error("Error sending verification email", error.message);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "f1847856-f533-4cb5-9d47-1b61656c5748",
      template_variables: {
        company_info_name: "Auth company",
        name: name,
      },
    });
    console.log("Welcome Email sent successfuly",response);
    
    
  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error("Error sending welcome email", error.message);
  }
};
