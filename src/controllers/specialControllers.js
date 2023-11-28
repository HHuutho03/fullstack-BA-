import specialService from "../services/specialService";

let addNewSpecial = async (req, res) => {
  try {
    let response = await specialService.addSpecialService(req.body);
    console.log(response);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "error Form server",
    });
  }
};

let getAllSpecial = async (req, res) => {
  try {
    let response = await specialService.getAllSpecialService();
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "error from server",
    });
  }
};
let getDetailSpecialById = async (req, res) => {
  try {
    let response = await specialService.getDetailSpecialByIdService(
      req.query.id,
      req.query.location
    );
    return res.status(200).json(response);
  } catch (error) {
    let response = console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "error from server",
    });
  }
};

module.exports = {
  addNewSpecial: addNewSpecial,
  getAllSpecial: getAllSpecial,
  getDetailSpecialById: getDetailSpecialById,
};
