const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} = require("../controllers/jobs");
const testUser = require("../middlewares/testUser");
const router = require("express").Router();
router.route("/").get(getJobs).post(createJob);
router.route("/stats").get(showStats);
router
  .route("/:id")
  .get(getJob)
  .patch(testUser, updateJob)
  .delete(testUser, deleteJob);

module.exports = router;
