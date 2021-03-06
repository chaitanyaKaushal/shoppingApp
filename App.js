import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import productsReducers from './centralstore/reducers/products'
import { Provider } from 'react-redux'
import NavigationContainer from './navigation/NavigationContainer'
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font'
import cartReducer from './centralstore/reducers/cart'
import orderReducer from './centralstore/reducers/order'
import authReducer from './centralstore/reducers/auth'
import { LogBox } from 'react-native'
LogBox.ignoreAllLogs()

import ReduxThunk from 'redux-thunk'

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./fonts/OpenSans-Bold.ttf'),
  })
}

const rootReducer = combineReducers({
  products: productsReducers,
  cart: cartReducer,
  order: orderReducer,
  auth: authReducer,
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false)
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    )
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
      {/* redux works under its child components only */}
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
