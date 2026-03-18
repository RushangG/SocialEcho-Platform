const Log = require("../models/log.model");
const dayjs = require("dayjs");
const formatCreatedAt = require("../utils/timeConverter");
const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");
const AdminToken = require("../models/token.admin.model");
const Config = require("../models/config.model");
const Community = require("../models/community.model");
const User = require("../models/user.model");
const Rule = require("../models/rule.model");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");

/**
 * @route GET /admin/logs
 */
const retrieveLogInfo = async (req, res) => {
  try {
    // Only sign in logs contain encrypted context data & email
    const [signInLogs, generalLogs] = await Promise.all([
      Log.find({ type: "sign in" }).sort({ createdAt: -1 }).limit(50),

      Log.find({ type: { $ne: "sign in" } })
        .sort({ createdAt: -1 })
        .limit(50),
    ]);

    const formattedSignInLogs = [];
    for (let i = 0; i < signInLogs.length; i++) {
      const { _id, email, context, message, type, level, timestamp } =
        signInLogs[i];
      const contextData = context.split(",");
      const formattedContext = {};

      for (let j = 0; j < contextData.length; j++) {
        const [key, value] = contextData[j].split(":");
        if (key === "IP") {
          formattedContext["IP Address"] = contextData[j]
            .split(":")
            .slice(1)
            .join(":");
        } else {
          formattedContext[key.trim()] = value.trim();
        }
      }

      formattedSignInLogs.push({
        _id,
        email,
        contextData: formattedContext,
        message,
        type,
        level,
        timestamp,
      });
    }
    const formattedGeneralLogs = generalLogs.map((log) => ({
      _id: log._id,
      email: log.email,
      message: log.message,
      type: log.type,
      level: log.level,
      timestamp: log.timestamp,
    }));

    const formattedLogs = [...formattedSignInLogs, ...formattedGeneralLogs]
      .map((log) => ({
        ...log,
        formattedTimestamp: formatCreatedAt(log.timestamp),
        relativeTimestamp: dayjs(log.timestamp).fromNow(),
      }))
      .sort((a, b) => b.timestamp - a.timestamp);

    res.status(200).json(formattedLogs);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @route DELETE /admin/logs
 */
const deleteLogInfo = async (req, res) => {
  try {
    await Log.deleteMany({});
    res.status(200).json({ message: "All logs deleted!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong!" });
  }
};

/**
 * @route POST /admin/signin
 */
const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await Admin.findOne({
      username,
    });
    if (!existingUser) {
      return res.status(404).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const payload = {
      id: existingUser._id,
      username: existingUser.username,
    };

    const accessToken = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "6h",
    });

    const newAdminToken = new AdminToken({
      user: existingUser._id,
      accessToken,
    });

    await newAdminToken.save();

    res.status(200).json({
      accessToken,
      accessTokenUpdatedAt: new Date().toLocaleString(),
      user: {
        _id: existingUser._id,
        username: existingUser.username,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

/**
 * @route GET /admin/preferences
 */
const retrieveServicePreference = async (req, res) => {
  try {
    const config = await Config.findOne({});

    if (!config) {
      const newConfig = new Config();
      await newConfig.save();
      return res.status(200).json(newConfig);
    }

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving system preferences" });
  }
};

/**
 * @route PUT /admin/preferences
 */
const updateServicePreference = async (req, res) => {
  try {
    const {
      usePerspectiveAPI,
      categoryFilteringServiceProvider,
      categoryFilteringRequestTimeout,
    } = req.body;

    const config = await Config.findOneAndUpdate(
      {},
      {
        usePerspectiveAPI,
        categoryFilteringServiceProvider,
        categoryFilteringRequestTimeout,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(config);
  } catch (error) {
    res.status(500).json({ message: "Error updating system preferences" });
  }
};

const getCommunities = async (req, res) => {
  try {
    const communities = await Community.find({}).select("_id name banner");
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving communities" });
  }
};

const getCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId)
      .select("_id name description banner moderators members")
      .populate("moderators", "_id name")
      .lean();

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const moderatorCount = community.moderators.length;
    const memberCount = community.members.length;
    const formattedCommunity = {
      ...community,
      memberCount,
      moderatorCount,
    };
    res.status(200).json(formattedCommunity);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving community" });
  }
};

const getModerators = async (req, res) => {
  try {
    const moderators = await User.find({ role: "moderator" }).select(
      "_id name email"
    );
    res.status(200).json(moderators);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving moderators" });
  }
};
const addModerator = async (req, res) => {
  try {
    const { communityId, moderatorId } = req.query;
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const existingModerator = community.moderators.find(
      (mod) => mod.toString() === moderatorId
    );
    if (existingModerator) {
      return res.status(400).json({ message: "Already a moderator" });
    }
    community.moderators.push(moderatorId);
    community.members.push(moderatorId);
    await community.save();
    res.status(200).json({ message: "Moderator added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error adding moderator" });
  }
};

const removeModerator = async (req, res) => {
  try {
    const { communityId, moderatorId } = req.query;

    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const existingModerator = community.moderators.find(
      (mod) => mod.toString() === moderatorId
    );
    if (!existingModerator) {
      return res.status(400).json({ message: "Not a moderator" });
    }
    community.moderators = community.moderators.filter(
      (mod) => mod.toString() !== moderatorId
    );
    community.members = community.members.filter(
      (mod) => mod.toString() !== moderatorId
    );

    await community.save();
    res.status(200).json({ message: "Moderator removed" });
  } catch (error) {
    res.status(500).json({ message: "Error removing moderator" });
  }
};

/**
 * @route POST /admin/create-moderator
 * Create a new moderator user (admin only)
 */
const createModerator = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create moderator user
    const moderator = new User({
      name,
      email,
      password: hashedPassword,
      role: "moderator",
      avatar: "https://raw.githubusercontent.com/nz-m/public-files/main/dp.jpg", // Default avatar
      isEmailVerified: true, // Admin created moderators are auto-verified
    });

    await moderator.save();

    res.status(201).json({
      message: "Moderator created successfully",
      moderator: {
        _id: moderator._id,
        name: moderator.name,
        email: moderator.email,
        role: moderator.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }
    res.status(500).json({
      message: "Error creating moderator",
      error: error.message,
    });
  }
};

/**
 * @route GET /admin/users
 * Get all users (for admin to see and manage)
 */
const getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};

    // Filter by role if provided
    if (role && role !== "all") {
      query.role = role;
    }

    // Search by name or email if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("_id name email role avatar createdAt")
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users" });
  }
};

/**
 * @route PATCH /admin/users/:userId/role
 * Update user role (promote to moderator or demote to general)
 */
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["general", "moderator"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role. Must be 'general' or 'moderator'",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't allow changing admin role
    if (user.role === "admin") {
      return res.status(400).json({
        message: "Cannot change admin role",
      });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    res.status(200).json({
      message: `User role updated from ${oldRole} to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user role",
      error: error.message,
    });
  }
};

/**
 * @route POST /admin/create-admin
 */
const createAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const admin = new Admin({
      username,
      password,
    });

    await admin.save();

    res.status(201).json({
      message: "Admin user created successfully",
      admin: {
        _id: admin._id,
        username: admin.username,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }
    res.status(500).json({
      message: "Error creating admin user",
      error: error.message,
    });
  }
};

/**
 * @route POST /admin/communities
 * Supports:
 * 1. File upload with form-data (single community with banner image)
 * 2. JSON body with communities array or single community
 * 3. useDefaultData flag to load from JSON file
 */
const addCommunities = async (req, res) => {
  try {
    const { communities, useDefaultData, name, description } = req.body;
    let communitiesToAdd = [];

    console.log("addCommunities called with:", {
      hasBannerUrl: !!req.bannerUrl,
      bannerUrl: req.bannerUrl,
      name,
      description,
      hasCommunities: !!communities,
      useDefaultData,
    });

    // Case 1: File upload with form-data (single community)
    // If banner was uploaded, req.bannerUrl will be set by middleware
    if (req.bannerUrl && name) {
      console.log("Case 1: File upload with banner");
      // Single community with uploaded banner
      communitiesToAdd = [
        {
          name,
          description: description || "",
          banner: req.bannerUrl,
        },
      ];
    }
    // Case 2: useDefaultData flag - load from JSON file
    else if (useDefaultData) {
      const communitiesPath = path.join(
        __dirname,
        "..",
        "data",
        "communities.json"
      );
      const defaultCommunities = JSON.parse(
        fs.readFileSync(communitiesPath, "utf8")
      );
      communitiesToAdd = defaultCommunities;
    }
    // Case 3: JSON body with communities array
    else if (communities && Array.isArray(communities)) {
      communitiesToAdd = communities;
    }
    // Case 4: JSON body with single community object
    else if (communities && typeof communities === "object") {
      communitiesToAdd = [communities];
    }
    // Case 5: Single community from form-data without file
    else if (name) {
      // Only use banner from body if it's a valid URL, not a file path
      let bannerUrl = null;
      if (req.body.banner) {
        // Check if it's a URL (starts with http:// or https://)
        if (req.body.banner.startsWith("http://") || req.body.banner.startsWith("https://")) {
          bannerUrl = req.body.banner;
        } else if (!req.body.banner.startsWith("/") && !req.body.banner.includes("\\")) {
          // Might be a URL without protocol
          bannerUrl = req.body.banner;
        } else {
          // It's a file path, not a URL - warn user
          console.warn("Warning: banner field contains a file path. File upload may have failed. Use '@' in curl: -F 'banner=@/path/to/file'");
        }
      }
      communitiesToAdd = [
        {
          name,
          description: description || "",
          banner: bannerUrl,
        },
      ];
    } else {
      return res.status(400).json({
        message:
          "Invalid request. Provide 'communities' array, 'name' with optional 'banner' file, or set 'useDefaultData' to true",
      });
    }

    // Validate required fields
    for (const community of communitiesToAdd) {
      if (!community.name) {
        return res.status(400).json({
          message: "Community name is required",
        });
      }
    }

    // Get existing community names
    const existingCommunities = await Community.find({}, { name: 1 });
    const existingCommunityNames = existingCommunities.map((c) => c.name);

    // Filter out communities that already exist
    const newCommunities = communitiesToAdd.filter(
      (community) => !existingCommunityNames.includes(community.name)
    );

    if (newCommunities.length === 0) {
      return res.status(200).json({
        message: "All communities already exist in the database",
        added: 0,
        skipped: communitiesToAdd.length,
      });
    }

    // Insert new communities
    const insertedCommunities = await Community.insertMany(newCommunities);

    res.status(201).json({
      message: "Communities added successfully",
      added: insertedCommunities.length,
      skipped: communitiesToAdd.length - insertedCommunities.length,
      communities: insertedCommunities.map((c) => ({
        _id: c._id,
        name: c.name,
        banner: c.banner,
      })),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "One or more communities already exist",
      });
    }
    res.status(500).json({
      message: "Error adding communities",
      error: error.message,
    });
  }
};

/**
 * @route GET /admin/rules
 */
const getRules = async (req, res) => {
  try {
    const rules = await Rule.find({}).sort({ rule: 1 });
    res.status(200).json(rules);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving rules" });
  }
};

/**
 * @route POST /admin/rules
 */
const addRules = async (req, res) => {
  try {
    const { rules, useDefaultData } = req.body;

    let rulesToAdd = [];

    // If useDefaultData is true, load from JSON file
    if (useDefaultData) {
      const rulesPath = path.join(
        __dirname,
        "..",
        "data",
        "moderationRules.json"
      );
      const defaultRules = JSON.parse(fs.readFileSync(rulesPath, "utf8"));
      rulesToAdd = defaultRules;
    } else if (rules && Array.isArray(rules)) {
      // Use provided rules array
      rulesToAdd = rules;
    } else if (rules && typeof rules === "object") {
      // Single rule object
      rulesToAdd = [rules];
    } else {
      return res.status(400).json({
        message:
          "Invalid request. Provide 'rules' array or set 'useDefaultData' to true",
      });
    }

    // Get existing rules
    const existingRules = await Rule.find({}, { rule: 1 });
    const existingRuleNames = existingRules.map((r) => r.rule);

    // Filter out rules that already exist
    const newRules = rulesToAdd.filter(
      (rule) => !existingRuleNames.includes(rule.rule)
    );

    if (newRules.length === 0) {
      return res.status(200).json({
        message: "All moderation rules already exist in the database",
        added: 0,
        skipped: rulesToAdd.length,
      });
    }

    // Insert new rules
    const insertedRules = await Rule.insertMany(newRules);

    res.status(201).json({
      message: "Moderation rules added successfully",
      added: insertedRules.length,
      skipped: rulesToAdd.length - insertedRules.length,
      rules: insertedRules.map((r) => ({
        _id: r._id,
        rule: r.rule,
      })),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "One or more rules already exist",
      });
    }
    res.status(500).json({
      message: "Error adding moderation rules",
      error: error.message,
    });
  }
};

/**
 * @route POST /admin/communities/:communityId/rules
 * Use communityId="all" or add ?all=true query parameter to add rules to all communities
 */
const addRulesToCommunity = async (req, res) => {
  try {
    let { communityId } = req.params;
    const { all } = req.query;
    const { ruleIds, useAllRules } = req.body;

    // Handle query parameter for "all" communities
    if (all === "true" || communityId === "all") {
      communityId = "all";
    }

    let rulesToAdd = [];

    if (useAllRules) {
      // Get all rules from database
      const allRules = await Rule.find({});
      rulesToAdd = allRules.map((r) => r._id);
    } else if (ruleIds && Array.isArray(ruleIds)) {
      // Use provided rule IDs
      rulesToAdd = ruleIds;
    } else {
      return res.status(400).json({
        message:
          "Invalid request. Provide 'ruleIds' array or set 'useAllRules' to true",
      });
    }

    // Validate that all rule IDs exist
    const existingRules = await Rule.find({
      _id: { $in: rulesToAdd },
    });
    if (existingRules.length !== rulesToAdd.length) {
      return res.status(400).json({
        message: "One or more rule IDs are invalid",
      });
    }

    if (communityId === "all" || !communityId) {
      // Add rules to all communities
      const communities = await Community.find();
      let updatedCount = 0;

      for (const community of communities) {
        await Community.findByIdAndUpdate(
          community._id,
          {
            $addToSet: {
              rules: { $each: rulesToAdd },
            },
          },
          { new: true }
        );
        updatedCount++;
      }

      res.status(200).json({
        message: "Rules added to all communities successfully",
        communitiesUpdated: updatedCount,
        rulesAdded: rulesToAdd.length,
      });
    } else {
      // Add rules to specific community
      const community = await Community.findByIdAndUpdate(
        communityId,
        {
          $addToSet: {
            rules: { $each: rulesToAdd },
          },
        },
        { new: true }
      );

      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      res.status(200).json({
        message: "Rules added to community successfully",
        community: {
          _id: community._id,
          name: community.name,
        },
        rulesAdded: rulesToAdd.length,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error adding rules to community",
      error: error.message,
    });
  }
};
/**
 * @route GET /admin/communities/:communityId/rules
 * Returns all rules (populated) for a specific community
 */
const getCommunityRules = async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId)
      .populate("rules")
      .select("rules")
      .lean();
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    res.status(200).json(community.rules);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving community rules" });
  }
};

/**
 * @route DELETE /admin/communities/:communityId/rules/:ruleId
 * Removes a rule reference from a community (Rule document is NOT deleted)
 */
const removeRuleFromCommunity = async (req, res) => {
  try {
    const { communityId, ruleId } = req.params;
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    await Community.findByIdAndUpdate(
      communityId,
      { $pull: { rules: ruleId } },
      { new: true }
    );
    res.status(200).json({ message: "Rule removed from community successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error removing rule from community" });
  }
};

module.exports = {

  retrieveServicePreference,
  updateServicePreference,
  retrieveLogInfo,
  deleteLogInfo,
  signin,
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
};
