import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialControllers from "../controllers/specialControllers";
import clinicController from "../controllers/clinicController";
let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);
  router.get("/about", homeController.getAboutPage);
  router.get("/crud", homeController.getCRUD);

  router.post("/post-crud", homeController.postCRUD);
  router.get("/get-crud", homeController.displayGetCRUD);
  router.get("/edit-crud", homeController.getEditCRUD);

  router.post("/put-crud", homeController.putCRUD);
  router.get("/delete-crud", homeController.deleteCRUD);

  ///get api db
  router.post("/api/login", userController.handleLoging);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUser);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);

  //get API allCode
  router.get("/api/allcode", userController.getallCode);
  router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/get-all-doctor", doctorController.getAllDoctor);
  router.post("/api/save-info-doctor", doctorController.saveInfoDoctor);
  router.get("/api/get-detail-doctor", doctorController.getDetailDoctor);

  router.get(
    "/api/get-list-patient-for-doctor",
    doctorController.getListPatientForDoctor
  );
  router.post("/api/send-remedy", doctorController.sendRemedy);

  //?create multiple time doctor services
  router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
  router.get("/api/get-schedule-date", doctorController.getScheduleDate);

  //? get doctor more information
  router.get(
    "/api/get-extra-infoDoctor-id",
    doctorController.getExtraInfoDoctorId
  );
  router.get(
    "/api/get-detail-doctor-profile",
    doctorController.getDetailDoctorProfile
  );

  router.post(
    "/api/patient-book-appointment",
    patientController.postBookAppointment
  );
  router.post(
    "/api/verify-appointment",
    patientController.postVerifyBookAppointment
  );

  //? add new special
  router.post("/api/add-new-special", specialControllers.addNewSpecial);
  router.get("/api/get-all-special", specialControllers.getAllSpecial);
  router.get(
    "/api/get-detail-special-id",
    specialControllers.getDetailSpecialById
  );
  //?add new clinic
  router.post("/api/create-new-clinic", clinicController.createClinic);
  router.get("/api/get-clinic", clinicController.getAllClinic);
  router.get(
    "/api/get-detail-clinic-by-id",
    clinicController.getDetailClinicById
  );

  return app.use("/", router);
};

module.exports = initWebRoutes;
