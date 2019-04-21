import * as ActionTypes from './ActionTypes';

export const carts = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_TO_CART:
            if (state.some(el => el === action.payload))
                return state;
            else
                return state.concat(action.payload);
               
         case ActionTypes.DELETE_ORDER:
            return state.filter((order) => order !== action.payload)

        default:
            return state;
    }
};