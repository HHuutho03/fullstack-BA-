import db from "../models/index";
require("dotenv").config();
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};
let postBookAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.timeType || !data.birthday) {
        resolve({
          errCode: -1,
          errMessage: "Missing input parameter",
        });
      } else {
        let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
        //? SEND TO EMAIL
        await emailService.sendSimpleEmail({
          reciverEmail: data.email,
          patientName: data.fullName,
          time: data.timeString,
          doctorName: data.doctorName,
          languages: data.languages,
          redirectLink: buildUrlEmail(data.doctorId, token),
        });

        let user = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            roleId: "R3",
            address: data.address,
            gender: data.selectedGender,
            address: data.address,
            firstName: data.fullName,
          },
        });
        if (user && user[0]) {
          console.log("check user, user[0]", user[0].id);
          await db.Booking.findOrCreate({
            where: { patientID: user[0].id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              patientID: user[0].id,
              date: data.birthday,
              timeType: data.timeType,
              token: token,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "save info patient successfully",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let postVerifyBookAppointmentService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.doctorId || !data.token) {
        resolve({
          errCode: -1,
          errMessage: "Missing input parameter",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: { doctorId: data.doctorId, token: data.token, statusId: "S1" },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Update appointment successfully",
          });
        } else {
          resolve({
            errCode: -2,
            errMessage: "appointment has been activated  or does not exist",
          });
        }
      }
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};
module.exports = {
  postBookAppointmentService: postBookAppointmentService,
  postVerifyBookAppointmentService: postVerifyBookAppointmentService,
};
