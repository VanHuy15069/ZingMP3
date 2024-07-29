import db from '../models';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

export const createContactService = (fullName, problem, phone, email, content) =>
  new Promise(async (resolve, reject) => {
    try {
      const contact = await db.Contact.create({
        fullName: fullName,
        problem: problem,
        phone: phone,
        email: email,
        content: content,
      });
      resolve({
        status: 'SUCCESS',
        data: contact,
      });
    } catch (error) {
      reject(error);
    }
  });

export const feedbackContactService = (feedback, id, token) =>
  new Promise(async (resolve, reject) => {
    try {
      const contact = await db.Contact.findByPk(id);
      if (!contact) {
        resolve({
          status: 'ERROR',
          msg: 'Data is not defined',
        });
      }
      if (contact.status) {
        resolve({
          status: 'ERROR',
          msg: 'This contact has been responded to',
        });
      } else {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false,
          auth: {
            user: 'vanhuy15069@gmail.com',
            pass: 'xvvj mygu uxbs iqvw',
          },
        });
        const email = {
          from: '"Van Huy" <vanhuy15069@gmail.com>',
          to: `${contact.email}`,
          subject: 'Email phản hồi',
          text: `${feedback}`,
          html: `<p>${feedback}</p>`,
        };
        jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
          if (err) {
            resolve({
              status: 'ERROR',
              msg: 'The authentication',
            });
          }
          if (user?.isAdmin) {
            transporter.sendMail(email, async (error, info) => {
              if (error) {
                resolve({
                  status: 'ERROR',
                  msg: 'Can not send email',
                  error: error,
                });
              }
              await contact.update({ status: true });
              resolve({
                staus: 'SUCCESS',
                data: info,
              });
            });
          } else {
            resolve({
              status: 'ERROR',
              msg: 'The authentication',
            });
          }
        });
      }
    } catch (error) {
      reject(error);
    }
  });
