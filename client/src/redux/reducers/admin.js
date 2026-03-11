import * as types from "../constants/adminConstants";

const initialState = {
  logs: [],
  servicePreferences: null,
  communities: null,
  community: null,
  moderators: null,
  rules: null,
  users: null,
  adminPanelError: null,
  signInError: null,
};

const adminReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.SIGN_IN_SUCCESS:
      return {
        ...state,
        signInError: null,
      };
    case types.SIGN_IN_FAIL:
      return {
        ...state,
        signInError: payload ? payload : null,
      };

    case types.LOGOUT_SUCCESS:
      return {
        ...state,
        adminAccessToken: null,
        logs: [],
        servicePreferences: null,
        communities: null,
        community: null,
        moderators: null,
        adminPanelError: null,
        signInError: null,
      };
    case types.GET_LOGS_SUCCESS:
      return {
        ...state,
        logs: payload ? payload : [],
        adminPanelError: null,
      };

    case types.GET_LOGS_FAIL:
      return {
        ...state,
        logs: [],
        adminPanelError: payload ? payload : [],
      };

    case types.DELETE_LOGS_SUCCESS:
      return {
        ...state,
        logs: [],
        adminPanelError: null,
      };

    case types.DELETE_LOGS_FAIL:
      return {
        ...state,
        logs: null,
        adminPanelError: payload ? payload : [],
      };

    case types.GET_SERVICE_PREFERENCES_SUCCESS:
      return {
        ...state,
        servicePreferences: payload ? payload : null,
        adminPanelError: null,
      };

    case types.GET_SERVICE_PREFERENCES_FAIL:
      return {
        ...state,
        servicePreferences: null,
        adminPanelError: payload ? payload : null,
      };

    case types.UPDATE_SERVICE_PREFERENCES_SUCCESS:
      return {
        ...state,
        servicePreferences: payload ? payload : null,
        adminPanelError: null,
      };

    case types.GET_COMMUNITIES_SUCCESS:
      return {
        ...state,
        communities: payload ? payload : null,
        adminPanelError: null,
      };

    case types.GET_COMMUNITIES_FAIL:
      return {
        ...state,
        communities: null,
        adminPanelError: payload ? payload : null,
      };

    case types.GET_COMMUNITY_SUCCESS:
      return {
        ...state,
        community: payload ? payload : null,
        adminPanelError: null,
      };
    case types.GET_COMMUNITY_FAIL:
      return {
        ...state,
        community: null,
        adminPanelError: payload ? payload : null,
      };

    case types.GET_MODERATORS_SUCCESS:
      return {
        ...state,
        moderators: payload ? payload : null,
        adminPanelError: null,
      };
    case types.GET_MODERATORS_FAIL:
      return {
        ...state,
        moderators: null,
        adminPanelError: payload ? payload : null,
      };
    case types.ADD_MODERATOR_SUCCESS:
      return {
        ...state,
        adminPanelError: null,
      };
    case types.ADD_MODERATOR_FAIL:
      return {
        ...state,
        adminPanelError: payload ? payload : null,
      };
    case types.REMOVE_MODERATOR_SUCCESS:
      return {
        ...state,
        adminPanelError: null,
      };
    case types.REMOVE_MODERATOR_FAIL:
      return {
        ...state,
        adminPanelError: payload ? payload : null,
      };
    case types.CREATE_ADMIN_SUCCESS:
      return {
        ...state,
        adminPanelError: null,
      };
    case types.CREATE_ADMIN_FAIL:
      return {
        ...state,
        adminPanelError: payload ? payload : null,
      };
    case types.ADD_COMMUNITIES_SUCCESS:
      return {
        ...state,
        adminPanelError: null,
      };
    case types.ADD_COMMUNITIES_FAIL:
      return {
        ...state,
        adminPanelError: payload ? payload : null,
      };
    case types.GET_RULES_SUCCESS:
      return {
        ...state,
        rules: payload ? payload : null,
        adminPanelError: null,
      };
    case types.GET_RULES_FAIL:
      return {
        ...state,
        rules: null,
        adminPanelError: payload ? payload : null,
      };
    case types.ADD_RULES_SUCCESS:
      return {
        ...state,
        adminPanelError: null,
      };
    case types.ADD_RULES_FAIL:
      return {
        ...state,
        adminPanelError: payload ? payload : null,
      };
    case types.ADD_RULES_TO_COMMUNITY_SUCCESS:
      return {
        ...state,
        adminPanelError: null,
      };
    case types.ADD_RULES_TO_COMMUNITY_FAIL:
      return {
        ...state,
        adminPanelError: payload ? payload : null,
      };
    case types.CREATE_MODERATOR_SUCCESS:
      return {
        ...state,
        adminPanelError: null,
      };
    case types.CREATE_MODERATOR_FAIL:
      return {
        ...state,
        adminPanelError: payload ? payload : null,
      };
    case types.GET_ALL_USERS_SUCCESS:
      return {
        ...state,
        users: payload ? payload : null,
        adminPanelError: null,
      };
    case types.GET_ALL_USERS_FAIL:
      return {
        ...state,
        users: null,
        adminPanelError: payload ? payload : null,
      };
    case types.UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state,
        adminPanelError: null,
      };
    case types.UPDATE_USER_ROLE_FAIL:
      return {
        ...state,
        adminPanelError: payload ? payload : null,
      };
    default:
      return state;
  }
};

export default adminReducer;
