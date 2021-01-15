import React, { useEffect, useRef } from 'react'
import ShopNavigator from './shopNavigator'
import { useSelector } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { AsyncStorage } from 'react-native'

const NavigationContainer = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token) // reason for using redux is to figure out whether we have the token or not as managed by redux store
  const navRef = useRef()

  useEffect(() => {
    if (!isAuth) {
      //navigate to Auth
      navRef.current.dispatch(NavigationActions.navigate({ routeName: 'Auth' })) //dispatch is implemented by createAppContainer wrapping shop navigator
    }
  }, [isAuth])

  return <ShopNavigator ref={navRef} />
}

export default NavigationContainer
