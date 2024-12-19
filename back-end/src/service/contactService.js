import db from '../models';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
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
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
        const email = {
          from: `"Music Studio" <${process.env.EMAIL}>`,
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

export const getAllContactService = (limit = 10, offset = 0, status) =>
  new Promise(async (resolve, reject) => {
    try {
      const obj = {};
      if (status) obj.where = { status: status };
      const contacts = await db.Contact.findAndCountAll({
        ...obj,
        limit: Number(limit),
        offset: Number(limit) * Number(offset),
        order: [['createdAt', 'DESC']],
      });
      resolve({
        status: 'SUCCESS',
        data: contacts,
        currentPage: offset,
        totalPage: Math.ceil(contacts.count / Number(limit)),
      });
    } catch (error) {
      reject(error);
    }
  });

export const deleteManyContactService = (contactIds) =>
  new Promise(async (resolve, reject) => {
    try {
      const contacts = await db.Contact.findAll({
        where: {
          id: { [Op.in]: contactIds },
        },
      });
      const checkFeedback = contacts.some((item) => item.status == false);
      if (checkFeedback) {
        resolve({
          status: 'WANRING',
          msg: 'Tồn tại nội dung vẫn chưa phản hồi!',
        });
      } else {
        const contactsDeleted = await db.Contact.destroy({
          where: {
            id: { [Op.in]: contactIds },
          },
        });
        resolve({
          status: 'SUCCESS',
          count: contactsDeleted,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
