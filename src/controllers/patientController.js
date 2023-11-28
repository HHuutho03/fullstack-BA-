import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
  try {
    let response = await patientService.postBookAppointmentService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "error form server",
    });
  }
};
let postVerifyBookAppointment = (req, res) => {
  try {
    let response = patientService.postVerifyBookAppointmentService(req.body);
    return res.status(200).json(response);
  } catch (error) {
    console.log("Error", error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "error form server",
    });
  }
};
module.exports = {
  postBookAppointment: postBookAppointment,
  postVerifyBookAppointment: postVerifyBookAppointment,
};
