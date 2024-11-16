import nodemailer from 'nodemailer';

class Transporter {
  private data = {
    from: process.env.SECRET_MAIL_ID,
    to: '',
    subject: 'Use this Reset Password Token for login',
    text: ''
  };

  public transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SECRET_MAIL_ID,
      pass: process.env.SECRET_MAIL_PASSWORD
    }
  });

  public sendMail = async (forgetPasswordAccessToken: string, email: string) => {
    this.data.to = email;
    this.data.text = `Your reset password token is '${forgetPasswordAccessToken}'`;
    return await this.transporter.sendMail(this.data);
  };
}

export default new Transporter();