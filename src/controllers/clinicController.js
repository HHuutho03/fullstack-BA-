import clinicService from "../services/clinicService";

let createClinic = async (req, res) => {
  try {
    let info = await clinicService.createClinicService();
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    res.status(200).json({
      errCode: -1,
      errMessage: "error from server",
    });
  }
};
let getAllClinic = async (req, res) => {
  try {
    let info = await clinicService.getAllClinic();

    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    res.status(200).json({
      errCode: -1,
      errMessage: "error from server",
    });
  }
};
let getDetailClinicById = async (req, res) => {
  try {
    let info = await clinicService.getDetailClinicById(req.query.id);
    console.log("check info", info);
    console.log("check req.query.id", req.query.id);
    return res.status(200).json(info);
  } catch (error) {
    console.log(error);
    res.status(200).json({
      errCode: -1,
      errMessage: "error from server",
    });
  }
};
module.exports = {
  createClinic,
  getAllClinic,
  getDetailClinicById,
};
