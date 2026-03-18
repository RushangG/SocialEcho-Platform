import * as api from "../api/adminAPI";
import * as types from "../constants/adminConstants";

export const signInAction = (credential) => async (dispatch) => {
  try {
    const { error, data } = await api.signIn(credential);
    if (error) {
      throw new Error(error);
    }
    localStorage.setItem("admin", JSON.stringify(data));
    dispatch({
      type: types.SIGN_IN_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: types.SIGN_IN_FAIL,
      payload: error.message,
    });
  }
};

export const logoutAction = () => async (dispatch) => {
  try {
    localStorage.removeItem("admin");
    dispatch({
      type: types.LOGOUT_SUCCESS,
    });
  } catch (error) { }
};

export const getLogsAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getLogs();
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.GET_LOGS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_LOGS_FAIL,
      payload: error.message,
    });
  }
};

export const deleteLogsAction = () => async (dispatch) => {
  try {
    const { error } = await api.deleteLogs();
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.DELETE_LOGS_SUCCESS,
    });
  } catch (error) {
    dispatch({
      type: types.DELETE_LOGS_FAIL,
      payload: error.message,
    });
  }
};

export const getServicePreferencesAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getServicePreferences();
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.GET_SERVICE_PREFERENCES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_SERVICE_PREFERENCES_FAIL,
      payload: error.message,
    });
  }
};

export const updateServicePreferencesAction =
  (preferences) => async (dispatch) => {
    try {
      const { error } = await api.updateServicePreferences(preferences);
      if (error) {
        throw new Error(error);
      }
      dispatch({
        type: types.UPDATE_SERVICE_PREFERENCES_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: types.UPDATE_SERVICE_PREFERENCES_FAIL,
        payload: error.message,
      });
    }
  };

export const getCommunitiesAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getCommunities();
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.GET_COMMUNITIES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_COMMUNITIES_FAIL,
      payload: error.message,
    });
  }
};

export const getCommunityAction = (communityId) => async (dispatch) => {
  try {
    const { error, data } = await api.getCommunity(communityId);
    if (error) {
      throw new Error(error);
    }

    dispatch({
      type: types.GET_COMMUNITY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_COMMUNITY_FAIL,
      payload: error.message,
    });
  }
};

export const getModeratorsAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getModerators();
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.GET_MODERATORS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_MODERATORS_FAIL,
      payload: error.message,
    });
  }
};

export const addModeratorAction =
  (communityId, moderatorId) => async (dispatch) => {
    try {
      const { error } = await api.addModerator(communityId, moderatorId);
      if (error) {
        throw new Error(error);
      }
      dispatch({
        type: types.ADD_MODERATOR_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: types.ADD_MODERATOR_FAIL,
        payload: error.message,
      });
    }
  };

export const removeModeratorAction =
  (communityId, moderatorId) => async (dispatch) => {
    try {
      const { error } = await api.removeModerator(communityId, moderatorId);
      if (error) {
        throw new Error(error);
      }
      dispatch({
        type: types.REMOVE_MODERATOR_SUCCESS,
      });
    } catch (error) {
      dispatch({
        type: types.REMOVE_MODERATOR_FAIL,
        payload: error.message,
      });
    }
  };

export const createAdminAction = (adminData) => async (dispatch) => {
  try {
    const { error, data } = await api.createAdmin(adminData);
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.CREATE_ADMIN_SUCCESS,
      payload: data,
    });
    return { success: true, data };
  } catch (error) {
    dispatch({
      type: types.CREATE_ADMIN_FAIL,
      payload: error.message,
    });
    return { success: false, error: error.message };
  }
};

export const addCommunitiesAction = (formData) => async (dispatch) => {
  try {
    const { error, data } = await api.addCommunities(formData);
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.ADD_COMMUNITIES_SUCCESS,
      payload: data,
    });
    // Refresh communities list
    dispatch(getCommunitiesAction());
    return { success: true, data };
  } catch (error) {
    dispatch({
      type: types.ADD_COMMUNITIES_FAIL,
      payload: error.message,
    });
    return { success: false, error: error.message };
  }
};

export const getRulesAction = () => async (dispatch) => {
  try {
    const { error, data } = await api.getRules();
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.GET_RULES_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_RULES_FAIL,
      payload: error.message,
    });
  }
};

export const addRulesAction = (rulesData) => async (dispatch) => {
  try {
    const { error, data } = await api.addRules(rulesData);
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.ADD_RULES_SUCCESS,
      payload: data,
    });
    // Refresh rules list
    dispatch(getRulesAction());
    return { success: true, data };
  } catch (error) {
    dispatch({
      type: types.ADD_RULES_FAIL,
      payload: error.message,
    });
    return { success: false, error: error.message };
  }
};

export const addRulesToCommunityAction =
  (communityId, rulesData) => async (dispatch) => {
    try {
      const { error, data } = await api.addRulesToCommunity(
        communityId,
        rulesData
      );
      if (error) {
        throw new Error(error);
      }
      dispatch({
        type: types.ADD_RULES_TO_COMMUNITY_SUCCESS,
        payload: data,
      });
      return { success: true, data };
    } catch (error) {
      dispatch({
        type: types.ADD_RULES_TO_COMMUNITY_FAIL,
        payload: error.message,
      });
      return { success: false, error: error.message };
    }
  };

export const createModeratorAction = (moderatorData) => async (dispatch) => {
  try {
    const { error, data } = await api.createModerator(moderatorData);
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.CREATE_MODERATOR_SUCCESS,
      payload: data,
    });
    // Refresh users list
    dispatch(getAllUsersAction());
    return { success: true, data };
  } catch (error) {
    dispatch({
      type: types.CREATE_MODERATOR_FAIL,
      payload: error.message,
    });
    return { success: false, error: error.message };
  }
};

export const getAllUsersAction = (params = {}) => async (dispatch) => {
  try {
    const { error, data } = await api.getAllUsers(params);
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.GET_ALL_USERS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: types.GET_ALL_USERS_FAIL,
      payload: error.message,
    });
  }
};

export const updateUserRoleAction = (userId, role) => async (dispatch) => {
  try {
    const { error, data } = await api.updateUserRole(userId, role);
    if (error) {
      throw new Error(error);
    }
    dispatch({
      type: types.UPDATE_USER_ROLE_SUCCESS,
      payload: data,
    });
    // Refresh users list
    dispatch(getAllUsersAction());
    return { success: true, data };
  } catch (error) {
    dispatch({
      type: types.UPDATE_USER_ROLE_FAIL,
      payload: error.message,
    });
    return { success: false, error: error.message };
  }
};

export const getCommunityRulesAction = (communityId) => async (dispatch) => {
  try {
    const { error, data } = await api.getCommunityRules(communityId);
    if (error) throw new Error(error);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const removeRuleFromCommunityAction =
  (communityId, ruleId) => async (dispatch) => {
    try {
      const { error, data } = await api.removeRuleFromCommunity(communityId, ruleId);
      if (error) throw new Error(error);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
