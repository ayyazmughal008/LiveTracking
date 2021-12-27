import { combineReducers } from "redux";
import {
  AUTH_LOADING,
  IS_FIRST,
  LOGIN,
  FCM_TOKEN,
  MY_CONTACTS
} from "./action";

const initialUserState = {
  AuthLoading: false,
  isFirst: false,
  login: "",
  token: "",
  myContacts: []
};

const userReducer = (state = initialUserState, action) => {

  if (action.type === AUTH_LOADING) {
    return {
      ...state,
      AuthLoading: action.payload
    };
  }
  if (action.type === IS_FIRST) {
    return {
      ...state,
      isFirst: action.payload.isFirst
    };
  }
  if (action.type === LOGIN) {
    return {
      ...state,
      login: action.payload.login
    };
  }
  if (action.type === FCM_TOKEN) {
    return {
      ...state,
      token: action.payload.token
    };
  }
  if (action.type === MY_CONTACTS) {
    return {
      ...state,
      myContacts: action.payload.myContacts
    };
  }

  return state;
};


const reducer = combineReducers({
  user: userReducer,
});
export default reducer;