// this screen is shown when the app is booting up, chances are it would not be displayed because booting speed is really fast.
//this screen fetches the stored userId and token from the device storage

import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native'
import Colors from '../constants/Colors'
import { useDispatch } from 'react-redux'
import * as authActions from '../centralstore/actions/auth'

const StartupScreen = (props) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData') //AsyncStorage.getItem() is async

      if (!userData) {
        // no token
        props.navigation.navigate('Auth')
        return
      }
      const transformedData = JSON.parse(userData) //converts to js obj or array
      const { token, userId, expiry } = transformedData
      //check if the token is valid
      const expirationDate = new Date(expiry)

      if (expirationDate <= new Date() || !token || !userId) {
        AsyncStorage.removeItem('userData')
        props.navigation.navigate('Auth')
        return
      }

      const remainingTimeForToken =
        expirationDate.getTime() - new Date().getTime()

      dispatch(authActions.authenticate(userId, token, remainingTimeForToken))
      props.navigation.navigate('Shop') // when all is set then navigate to shopscreen and before that dispatch authenicate action
    }

    tryLogin()
  }, [dispatch])

  return (
    <View style={styles.screen}>
      <ActivityIndicator size='large' color={Colors.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default StartupScreen
