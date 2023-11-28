import doctorService from "../services/doctorService";
let getTopDoctorHome = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  try {
    let response = await doctorService.getTopDoctorService(+limit);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errorCode: -1,
      errMessage: "error from server",
    });
  }
};
let getAllDoctor = async (req, res) => {
  try {
    let response = await doctorService.getallDoctorService();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "error from server",
    });
  }
};

let saveInfoDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveInfoDoctorService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "error form server",
    });
  }
};
let getDetailDoctor = async (req, res) => {
  try {
    let response = await doctorService.getDetailDoctorService(req.query.id);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      error: -1,
      errMessage: "error form server",
    });
  }
};

let bulkCreateSchedule = async (req, res) => {
  try {
    let response = await doctorService.getBulkCreateSchedule(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      error: -1,
      errMessage: "error form server",
    });
  }
};
let getScheduleDate = async (req, res) => {
  try {
    let response = await doctorService.getScheduleDateService(
      req.query.doctorId,
      req.query.date
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      errMessage: "error form server",
    });
  }
};
let getExtraInfoDoctorId = async (req, res) => {
  try {
    let response = await doctorService.getExtraInfoDoctorIdService(
      req.query.doctorId
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({
      errCode: -1,
      errMessage: "error form server",
    });
  }
};

let getDetailDoctorProfile = async (req, res) => {
  try {
    let response = await doctorService.getDetailDoctorProfileService(
      req.query.doctorId
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({
      errCode: 1,
      errMessage: "error from server",
    });
  }
};
let getListPatientForDoctor = async (req, res) => {
  try {
    let response = await doctorService.getListPatientForDoctor(
      req.query.doctorId,
      req.query.date
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({
      errCode: 1,
      errMessage: "error from server",
    });
  }
};

let sendRemedy = async (req, res) => {
  try {
    let info = await doctorService.sendRemedyService(req.body);
    console.log("check req", req.body);
    return res.status(200).json({
      info,
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      errCode: -1,
      errMessage: "error from server",
    });
  }
};

module.exports = {
  sendRemedy: sendRemedy,
  getListPatientForDoctor: getListPatientForDoctor,
  getTopDoctorHome: getTopDoctorHome,
  getAllDoctor: getAllDoctor,
  saveInfoDoctor: saveInfoDoctor,
  getDetailDoctor: getDetailDoctor,
  bulkCreateSchedule: bulkCreateSchedule,
  getScheduleDate: getScheduleDate,
  getExtraInfoDoctorId: getExtraInfoDoctorId,
  getDetailDoctorProfile: getDetailDoctorProfile,
};
