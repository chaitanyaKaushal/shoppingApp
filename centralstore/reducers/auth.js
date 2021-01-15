// import { SIGNIN, SIGNUP } from '../actions/auth'
import { AUTHENTICATE } from '../actions/auth'
import { LOGOUT } from '../actions/auth'

const initialState = {
  token: null,
  userId: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    // case SIGNIN:
    //   return {
    //     token: action.token,
    //     userId: action.userId,
    //   }
    // case SIGNUP:
    //   return {
    //     token: action.token,
    //     userId: action.userId,
    //   }
    case AUTHENTICATE:
      return {
        token: action.token,
        userId: action.userId,
      }
    case LOGOUT:
      return initialState
    default:
      return state
  }
}
