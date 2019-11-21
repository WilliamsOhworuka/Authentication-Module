import jwt from 'jsonwebtoken';
import sendgridMail from '@sendgrid/mail';
import userService from './userService';
import mail from '../helpers/confirmMail';


const { updateUser } = userService;

/**
 * Send mail service
 * @name sendMail
 * @param {string} senderMail
 * @param {string} receiverMail
 * @param {string} message
 * @returns {Func} a call to Sendgrid's send method
 */

const mailer = (senderMail, receiverMail, message) => {
  sendgridMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: receiverMail,
    from: senderMail,
    ...message
  };
  return sendgridMail.send(msg);
};

export default async (info) => {
  const { id, email } = info;
  const token = jwt.sign({ id }, process.env.my_secret, { expiresIn: '5h' });
  const text = `UPDATE users
                SET verificationToken = $1    
                WHERE id=$2`;
  const values = [token, id];
  await updateUser(id, text, values);

  const url = `${process.env.FRONTEND_URL}/confirmation-page?token=${token}`;
  const message = mail(info, url);
  mailer(process.env.HOST_EMAIL, email, message);
};
