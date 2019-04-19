import * as ActionTypes from './ActionTypes';

export const favorites = (state = [], action) => {
    switch (action.type) {
        case ActionTypes.ADD_FAVOURITE:
            if (state.some(el => el === action.payload))
                return state;
            else
                return state.concat(action.payload);

        default:
            return state;
    }
};