import * as ActionTypes from './ActionTypes';

export const users = (state = { errMess: null, users:[]}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_USER:
    var user = action.payload;
    return {...state, errMess: null, users:state.users.concat(user)};

    case ActionTypes.ADD_USERS:
      return {...state, errMess: null, users: action.payload};

    default:
      return state;
  }
};