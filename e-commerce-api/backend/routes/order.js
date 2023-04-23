const router = require("express").Router();
const {
  getAllOrders,
  getSingleOrder,
  createOrder,
  deleteOrder,
  updateOrder,
  getCurrentUserOrders,
} = require("../controllers/order");
const {
  authenticateUser,
  authorizePermession,
} = require("../middleware/authentication");
router
  .route("/")
  .get(authenticateUser, authorizePermession("admin"), getAllOrders)
  .post(authenticateUser, createOrder);
router.route("/show-me-orders").get(authenticateUser, getCurrentUserOrders);
router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder)
  .delete(authenticateUser, deleteOrder);

module.exports = router;
