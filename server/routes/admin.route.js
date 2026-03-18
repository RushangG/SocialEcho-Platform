const router = require("express").Router();

const {
  retrieveLogInfo,
  deleteLogInfo,
  signin,
  updateServicePreference,
  retrieveServicePreference,
  getCommunities,
  getCommunity,
  getCommunityRules,
  removeRuleFromCommunity,
  addModerator,
  removeModerator,
  getModerators,
  createAdmin,
  addCommunities,
  getRules,
  addRules,
  addRulesToCommunity,
  createModerator,
  getAllUsers,
  updateUserRole,
} = require("../controllers/admin.controller");

const requireAdminAuth = require("../middlewares/auth/adminAuth");
const {
  configLimiter,
  logLimiter,
  signUpSignInLimiter,
} = require("../middlewares/limiter/limiter");

router.post("/signin", signUpSignInLimiter, signin);

// router.use(requireAdminAuth);

// Admin management
router.post("/create-admin", createAdmin);

// Community management
router.get("/community/:communityId", getCommunity);
router.get("/communities", getCommunities);
const bannerUpload = require("../middlewares/admin/bannerUpload");
router.post("/communities", bannerUpload, addCommunities);

// Rules management
router.get("/rules", getRules);
router.post("/rules", addRules);
router.get("/communities/:communityId/rules", getCommunityRules);
router.post("/communities/:communityId/rules", addRulesToCommunity);
router.delete("/communities/:communityId/rules/:ruleId", removeRuleFromCommunity);

// Moderator management
router.get("/moderators", getModerators);
router.post("/create-moderator", createModerator);
router.get("/users", getAllUsers);
router.patch("/users/:userId/role", updateUserRole);
router.patch("/add-moderators", addModerator);
router.patch("/remove-moderators", removeModerator);

router
  .route("/preferences")
  .get(configLimiter, retrieveServicePreference)
  .put(configLimiter, updateServicePreference);
router
  .route("/logs")
  .get(logLimiter, retrieveLogInfo)
  .delete(logLimiter, deleteLogInfo);

module.exports = router;
