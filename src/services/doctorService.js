import db from "../models";
require("dotenv").config();
import _ from "lodash";
import emailService from "./emailService";
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorService = (limitInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit: limitInput,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attribute: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attribute: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });

      resolve({
        errCode: 0,
        data: users,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getallDoctorService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let doctors = await db.User.findAll({
        where: { roleId: "R2" },
        attributes: {
          exclude: ["password", "image"],
        },
      });
      resolve({
        errCode: 0,
        data: doctors,
      });
    } catch (error) {
      reject(error);
    }
  });
};
let checkRequiredFields = (dataInfo) => {
  console.log("check required fields", dataInfo);
  let arrField = [
    "doctorId",
    "contentHTML",
    "contentMarkdown",
    "action",
    "selectedPrice",
    "selectedProvince",
    "selectedPayment",
    "ClinicName",
    "ClinicAddress",
    "Note",
    "specialtyId",
  ];
  let isValid = true;
  let element = "";
  for (let i = 0; i < arrField.length; i++) {
    if (!dataInfo[arrField[i]]) {
      isValid = false;
      element = arrField[i];
      break;
    }
  }
  return {
    isValid: isValid,
    element: element,
  };
};

let saveInfoDoctorService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let checkOje = checkRequiredFields(inputData);
      if (checkOje === false) {
        resolve({
          errCode: -1,
          errMessage: `missing input parameter ${checkOje.element}`,
        });
      } else {
        if (inputData.action === "CREATE") {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        }
        if (inputData.action === "EDIT") {
          let markdownDoctor = await db.Markdown.findOne({
            where: { doctorId: inputData.doctorId },
            raw: false,
          });
          if (markdownDoctor) {
            (markdownDoctor.contentHTML = inputData.contentHTML),
              (markdownDoctor.contentMarkdown = inputData.contentMarkdown),
              (markdownDoctor.description = inputData.description),
              (markdownDoctor.updateAt = new Date());
            await markdownDoctor.save();
          }
        }
        //? upsert to doctor information
        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: inputData.doctorId },
          raw: false,
        });

        if (doctorInfo) {
          //?update information doctor
          (doctorInfo.doctorId = inputData.doctorId),
            (doctorInfo.priceId = inputData.selectedPrice),
            (doctorInfo.provinceId = inputData.selectedProvince),
            (doctorInfo.paymentId = inputData.selectedPayment),
            (doctorInfo.nameClinic = inputData.ClinicName),
            (doctorInfo.addressClinic = inputData.ClinicAddress);
          doctorInfo.note = inputData.Note;
          doctorInfo.specialtyId = inputData.specialId;
          doctorInfo.clinicId = inputData.clinicId;
          await doctorInfo.save();
        } else {
          //? create information doctor
          await db.Doctor_Info.create({
            doctorId: inputData.doctorId,
            priceId: inputData.selectedPrice,
            provinceId: inputData.selectedProvince,
            paymentId: inputData.selectedPayment,
            nameClinic: inputData.ClinicName,
            addressClinic: inputData.ClinicAddress,
            note: inputData.Note,
            specialtyId: inputData.specialId,
            clinicId: inputData.clinicId,
          });
        }
        resolve({
          errCode: 0,
          errMessage: "save information doctor successfully!",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailDoctorService = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputData) {
        resolve({
          errCode: -1,
          errMessage: "Missing required parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: inputData },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceIdTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentIdTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let getBulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule || !data.doctorId || !data.formatDate) {
        resolve({
          errCode: -1,
          errMessage: "missing required parameters",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item, index) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });
        }
        //?get all existing data
        let existing = await db.Schedule.findAll({
          where: { doctorId: data.doctorId, date: data.formatDate },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });
        //?compare different
        let toCreate = _.differenceWith(schedule, existing, (a, b) => {
          return a.timeType === b.timeType && a.date === b.date;
        });
        if (toCreate && toCreate === 0) {
          console.log("error code =1");
        }
        //create data
        if (toCreate && toCreate.length > 0) {
          await db.Schedule.bulkCreate(toCreate);
        }
      }
      resolve({
        error: 0,
        errMessage: "ok",
      });
    } catch (error) {
      reject(error);
    }
  });
};
let getScheduleDateService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: -1,
          errMessage: "missing required parameter",
        });
      } else {
        let dataSchedule = await db.Schedule.findAll({
          where: { doctorId: doctorId, date: date },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attribute: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorData",
              attribute: ["firstName", "lastName"],
            },
          ],
          raw: false,
          nest: true,
        });
        if (!dataSchedule) dataSchedule = [];
        resolve({
          errCode: 0,
          data: dataSchedule,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getExtraInfoDoctorIdService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: -1,
          errMessage: "missing parameter input",
        });
      } else {
        let data = await db.Doctor_Info.findOne({
          where: { doctorId: doctorId },
          attributes: {
            exclude: ["id", "doctorId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "priceTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceIdTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentIdTypeData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      console.log("check error: ", error);
      reject(error);
    }
  });
};

let getDetailDoctorProfileService = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: -1,
          errMessage: "missing input parameter",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: doctorId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Info,
              attributes: {
                exclude: ["id", "doctorId"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "priceTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceIdTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentIdTypeData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        if (data && data.image) {
          data.image = new Buffer(data.image, "base64").toString("binary");
        }
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getListPatientForDoctor = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({ errCode: -2, errMessage: "input missing parameter" });
      } else {
        let data = await db.Booking.findAll({
          where: { statusId: "S2", doctorId: doctorId, date: date },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "firstName", "address", "gender"],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeDataPatient",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: false,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let sendRemedyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.doctorId ||
        !data.email ||
        !data.patientId ||
        !data.timeType ||
        !data.imgBase64
      ) {
        resolve({ errCode: -2, errMessage: "input missing parameter" });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: "S2",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
        }
        await emailService.sendAttachment(data);
        resolve({
          errCode: 0,
          data: data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  sendRemedyService: sendRemedyService,
  getTopDoctorService: getTopDoctorService,
  getallDoctorService: getallDoctorService,
  saveInfoDoctorService: saveInfoDoctorService,
  getDetailDoctorService: getDetailDoctorService,
  getBulkCreateSchedule: getBulkCreateSchedule,
  getScheduleDateService: getScheduleDateService,
  getExtraInfoDoctorIdService: getExtraInfoDoctorIdService,
  getDetailDoctorProfileService: getDetailDoctorProfileService,
  getListPatientForDoctor: getListPatientForDoctor,
};
