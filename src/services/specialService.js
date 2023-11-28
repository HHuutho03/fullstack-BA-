import db from "../models/index";

let addSpecialService = (data) => {
  console.log("check data server", data);
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.imgBase64
      ) {
        resolve({
          errCode: -2,
          errMessage: "Missing input parameter",
        });
      } else {
        await db.Specialty.create({
          name: data.name,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkDown: data.descriptionMarkdown,
          image: data.imgBase64,
        });
        resolve({
          errCode: 0,
          errMessage: "create a new special success",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllSpecialService = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        data.map((item) => {
          item.image = new Buffer(item.image, "base64").toString("binary");
          return item;
        });
      }
      resolve({
        errCode: 0,
        errMessage: "ok",
        data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let getDetailSpecialByIdService = (inputId, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!inputId || !location) {
        resolve({
          errCode: -2,
          errMessage: "input missing parameter",
        });
      } else {
        let data = await db.Specialty.findOne({
          where: { id: inputId },
          attributes: ["descriptionHTML", "descriptionMarkDown"],
        });
        if (data) {
          let doctorSpecialty = [];
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: {
                specialtyId: inputId,
              },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            doctorSpecialty = await db.Doctor_Info.findAll({
              where: {
                specialtyId: inputId,
                provinceId: location,
              },
              attributes: ["doctorId", "provinceId"],
            });
          }
          data.doctorSpecialty = doctorSpecialty;
        } else data = {};
        resolve({
          errCode: 0,
          errMessage: "ok",
          data,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  addSpecialService,
  getAllSpecialService,
  getDetailSpecialByIdService,
};
