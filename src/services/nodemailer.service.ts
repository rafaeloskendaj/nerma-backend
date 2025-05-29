import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
const { SENDGRID_API_KEY, SENDGRID_EMAIL } = process.env;

export interface SendEmailOtpParams {
  email?: string;
  purpose?:
    | "blocklistwallet"
    | "unblocklistwallet"
    | "freezeWallet"
    | "deactivateWallet"
    | "unfreezeWallet"
    | "deActivateAccount"
    | "ActivateAccount"
    | "signup"
    | "login"
    | "reward"
    | "user-initiate-refund"
    | "admin-initiate-refund"
    | "refund-approved-user"
    | "refund-approved-admin"
    | "refund-rejected-admin"
    | "refund-rejected-user";
  message?: string;
  walletAddress?: string;
  otp?: string;
  amount?: string;
  totalSpend?: string;
  userId?: string;
  subscriptionId?: string;
  reason?: string;
  adminNote?: string;
  dashboardUrl?: string;
}

const MAIL_SETTINGS = {
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: SENDGRID_API_KEY,
  },
};

const transporter = nodemailer.createTransport(MAIL_SETTINGS);

export const sendEmail = async ({
  email,
  purpose,
  walletAddress,
  otp,
  amount,
  totalSpend,
  userId,
  subscriptionId,
  reason,
  adminNote,
  dashboardUrl,
}: SendEmailOtpParams): Promise<boolean> => {
  try {
    let htmlTemplate = "";
    let subject = "";
    let useremail = email;

    switch (purpose) {
      case "blocklistwallet": {
        const eoPath = path.join(__dirname, "../views/blocklistwallet.html");
        htmlTemplate = fs.readFileSync(eoPath, "utf8");
        htmlTemplate = htmlTemplate.replace("{{email}}", email);
        htmlTemplate = htmlTemplate.replace("{{walletAddress}}", walletAddress);
        subject = "Blocked WalletAddress";
        break;
      }
      case "unblocklistwallet": {
        const eoPath = path.join(__dirname, "../views/unblocklistwallet.html");
        htmlTemplate = fs.readFileSync(eoPath, "utf8");
        htmlTemplate = htmlTemplate.replace("{{email}}", email);
        htmlTemplate = htmlTemplate.replace("{{walletAddress}}", walletAddress);
        subject = "unblock WalletAddress";
        break;
      }

      case "freezeWallet": {
        const eoPath = path.join(__dirname, "../views/freezewallet.html");
        htmlTemplate = fs.readFileSync(eoPath, "utf8");
        htmlTemplate = htmlTemplate.replace("{{email}}", email);
        htmlTemplate = htmlTemplate.replace("{{walletAddress}}", walletAddress);
        subject = "freeze WalletAddress";
        break;
      }
      case "unfreezeWallet": {
        const ecPath = path.join(__dirname, "../views/unfreezewallet.html");
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate.replace(/{{email}}/g, email);
        htmlTemplate = htmlTemplate.replace("{{walletAddress}}", walletAddress);
        subject = "Unfreeze WalletAddress!";
        break;
      }
      case "deActivateAccount": {
        const ecPath = path.join(__dirname, "../views/deactivateAccount.html");
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate.replace(/{{email}}/g, email);
        htmlTemplate = htmlTemplate.replace("{{walletAddress}}", walletAddress);
        subject = "Account DeActivate";
        break;
      }

      case "ActivateAccount": {
        const ecPath = path.join(__dirname, "../views/activateAccount.html");
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate.replace(/{{email}}/g, email);
        htmlTemplate = htmlTemplate.replace("{{walletAddress}}", walletAddress);
        subject = "Account Activate";
        break;
      }

      case "signup": {
        const ecPath = path.join(__dirname, "../views/signup.html");
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate.replace(/{{email}}/g, email);
        htmlTemplate = htmlTemplate.replace("{{otp}}", otp);
        subject = "Signup OTP";
        break;
      }
      case "login": {
        const ecPath = path.join(__dirname, "../views/login.html");
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate.replace(/{{email}}/g, email);
        htmlTemplate = htmlTemplate.replace("{{otp}}", otp);
        subject = "Signup OTP";
        break;
      }
      case "reward": {
        const ecPath = path.join(__dirname, "../views/reward.html");
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate.replace(/{{email}}/g, email);
        htmlTemplate = htmlTemplate.replace("{{amount}}", amount);
        htmlTemplate = htmlTemplate.replace("{{totalSpend}}", totalSpend);
        subject = "Reward Message";
        break;
      }
      case "user-initiate-refund": {
        useremail = "myuser01email@yopmail.com";
        const ecPath = path.join(
          __dirname,
          "../views/userInitiatedrefund.html"
        );
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate.replace(/{{email}}/g, email);
        subject = "Refund-Initiate-Request";
        break;
      }

      case "admin-initiate-refund": {
        const ecPath = path.join(
          __dirname,
          "../views/adminInitiaterefund.html"
        );
        useremail = "tushar.shrivastava029@gmail.com";
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate.replace(/{{email}}/g, email);
        htmlTemplate = htmlTemplate.replace(/{{userId}}/g, userId);
        subject = "User-Refund-Request";
        break;
      }

      case "refund-approved-user": {
        const ecPath = path.join(__dirname, "../views/refund-approved-user.html");
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate
          .replace(/{{email}}/g, email)
          .replace(/{{subscriptionId}}/g, subscriptionId)
          .replace(/{{amount}}/g, amount.toString())
          .replace(/{{reason}}/g, reason)
          .replace(/{{adminNote}}/g, adminNote)
          .replace(/{{dashboardUrl}}/g, dashboardUrl);
        subject = "Your Refund Has Been Approved";
        break;
      }
      case "refund-approved-admin": {
        const ecPath = path.join(
          __dirname,
          "../views/refund-approved-admin.html"
        );
        useremail = 'tushar.shrivastava029@gmail.com';
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate
          .replace(/{{userEmail}}/g, email)
          .replace(/{{subscriptionId}}/g, subscriptionId)
          .replace(/{{amount}}/g, amount.toString())
          .replace(/{{reason}}/g, reason)
          .replace(/{{adminNote}}/g, adminNote);
        subject = "Refund Processed for User";
        break;
      }
      case "refund-rejected-admin": {
        const ecPath = path.join(
          __dirname,
          "../views/refund-rejected-admin.html"
        );
        useremail = 'tushar.shrivastava029@gmail.com';
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate
          .replace(/{{userEmail}}/g, email)
          .replace(/{{subscriptionId}}/g, subscriptionId)
          .replace(/{{reason}}/g, reason)
          .replace(/{{adminNote}}/g, adminNote);
        subject = "Refund Rejection Confirmed";
        break;
      }
      case "refund-rejected-user": {
        const ecPath = path.join(__dirname, "../views/refund-rejected-user.html");
        htmlTemplate = fs.readFileSync(ecPath, "utf8");
        htmlTemplate = htmlTemplate
          .replace(/{{email}}/g, email)
          .replace(/{{subscriptionId}}/g, subscriptionId)
          .replace(/{{reason}}/g, reason)
          .replace(/{{adminNote}}/g, adminNote);
        subject = "Your Refund Has Been Rejected";
        break;
      }

      
      default: {
        console.log("Invalid Purpose");
        return false;
      }
    }

    const mailOptions = {
      from: SENDGRID_EMAIL,
      to: useremail,
      subject,
      html: htmlTemplate,
      replyTo: email,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("mailOptions", mailOptions);
    console.log(`Mail sent`, useremail, info.messageId);
    return true;
  } catch (error) {
    console.log("Error in sending email >> %O", error);
    return false;
  }
};
