import { AsyncStorage } from 'react-native'

// export const SIGNUP = 'SIGNUP'
// export const SIGNIN = 'SIGNIN'
export const AUTHENTICATE = 'AUTHENTICATE'
export const LOGOUT = 'LOGOUT'

let timer

export const authenticate = (userId, token, expiryTime) => {
  return (dispatch) => {
    dispatch(logoutTimer(expiryTime))
    dispatch({ type: AUTHENTICATE, userId: userId, token: token })
  }
}

export const signup = (email, password) => {
  return async (dispatch) => {
    const resp = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAC4HhOynqdP1mHKuLtzbRAMQdMYlJ1ofQ',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    )

    if (!resp.ok) {
      let message = 'Something Went Wrong!'
      const errorResData = await resp.json()
      const errorId = errorResData.error.message
      if (errorId === 'EMAIL_EXISTS') {
        message = 'The Email already exists'
      } else if (errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        message = 'Unusual Activity detected from your device'
      }
      throw new Error(message)
    }

    const resData = await resp.json()
    // console.log(resData)

    // dispatch({ type: SIGNUP, token: resData.idToken, userId: resData.localId }) one and the same thing as done in below function

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    )

    const expiryDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    ) // inside the new Date we have time in milliseconds from 1970 till it expires. getTime() gives time in milliseconds
    saveDataToStorage(resData.idToken, resData.localId, expiryDate)
  }
}

export const signin = (email, password) => {
  return async (dispatch) => {
    const resp = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAC4HhOynqdP1mHKuLtzbRAMQdMYlJ1ofQ',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    )

    if (!resp.ok) {
      const errorResData = await resp.json()
      const errorId = errorResData.error.message
      let message = 'Something Went Wrong!'
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email does not exist'
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'Incorrect Password'
      }
      throw new Error(message)
    }

    const resData = await resp.json()
    // console.log(resData)

    // dispatch({ type: SIGNIN, token: resData.idToken, userId: resData.localId })

    dispatch(
      authenticate(
        resData.localId,
        resData.idToken,
        parseInt(resData.expiresIn) * 1000
      )
    )

    const expiryDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    ) // inside the new Date we have time in milliseconds from 1970 till it expires. getTime() gives time in milliseconds
    saveDataToStorage(resData.idToken, resData.localId, expiryDate)
  }
}

export const logout = () => {
  return (dispatch) => {
    clearLogoutTimer()
    AsyncStorage.removeItem('userData')
    dispatch({ type: LOGOUT })
  }
}

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer) // vanilla javascript function to delete the timer
  }
}

const logoutTimer = (expirationTime) => {
  //where expirationTime is time in millisecs
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout()) // to dispatch logout, Redux Thunk is used
    }, expirationTime)
  }
}

const saveDataToStorage = (token, userId, expiryDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiry: expiryDate.ISOString, // standardized string format
    })
  ) // userData is the name of our user-defined key
  //the value and key must be a string
}
