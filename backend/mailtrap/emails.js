import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";
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
      subject:"Welcome Email",
      html:WELCOME_EMAIL_TEMPLATE,
      category:"Reset password"
    })
    console.log("Welcome Email sent successfuly",response);
    
    
  } catch (error) {
    console.error(`Error sending welcome email`, error);
    throw new Error("Error sending welcome email", error.message);
  }
};

export const sendResetPasswordEmail = async (email,resetURL)=>{
  const recipients = [{email}]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject:"Reset your password",
      html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL),
      category:"Reset password"
    })
    console.log("Reset password email sent successfully",response);
  } catch (error) {
    console.log(`Error sending reset password email`,error);
    throw new Error("Error sending reset password email",error.message)
    
  }
}

export const sendResetSuccessEmail = async(email)=>{
  const recipients = [{email}]
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject:"Password reset successfully",
      html:PASSWORD_RESET_SUCCESS_TEMPLATE,
      category:"Reset password"
    })
    console.log("Reset password success email sent successfully",response);
    

  } catch (error) {
    console.log(`Error sending reset success email`,error);
    throw new Error("Error sending reset success email",error.message)
    
  }
}