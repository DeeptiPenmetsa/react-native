import * as ActionTypes from './ActionTypes';

export const users = (state = { errMess: null, users:[]}, action) => {
  switch (action.type) {
    case ActionTypes.ADD_USER:
    var user = action.payload;
    return {...state, users:state.users.concat(user)};

    default:
      return state;
  }
};