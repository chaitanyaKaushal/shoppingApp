import React, { useState, useReducer, useCallback, useEffect } from 'react'
import {
  ScrollView,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Button,
  ActivityIndicator,
  ActivityIndicatorBase,
  Alert,
} from 'react-native'
import { useDispatch } from 'react-redux'
import Input from '../../components/Input'
import AuthCard from '../../components/AuthCard'
import Colors from '../../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import * as authActions from '../../centralstore/actions/auth'

const FORM_UPDATE = 'UPDATE'

const formReducer = (state, action) => {
  //declared outside since it does not depend on props
  switch (action.type) {
    case FORM_UPDATE:
      const updatedValues = {
        ...state.inputValues,
        [action.input]: action.value,
      }
      const updatedValidities = {
        ...state.inputValidities,
        [action.input]: action.isValid,
      }

      let formIsValid = true
      for (const key in updatedValidities) {
        if (!updatedValidities[key]) {
          formIsValid = false
          break
        }
      }

      return {
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: formIsValid,
      }

    default:
      return state
  }
}

const AuthScreen = (props) => {
  const dispatch = useDispatch()
  const [isSignUp, setIsSignUp] = useState(false) //tells whether in signup mode or sign in mode
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  })

  const authHandler = async () => {
    setError(null)
    setIsLoading(true)
    try {
      if (isSignUp) {
        await dispatch(
          authActions.signup(
            formState.inputValues.email,
            formState.inputValues.password
          )
        )
      } else {
        await dispatch(
          authActions.signin(
            formState.inputValues.email,
            formState.inputValues.password
          )
        )
      }
      props.navigation.navigate('Shop')
    } catch (err) {
      setError(err.message)
      setIsLoading(false)
    }
  }

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      })
    },
    [dispatchFormState]
  )

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error, [
        { text: 'Okay', style: 'destructive' },
      ])
    }
  }, [error])

  return (
    <KeyboardAvoidingView
      behavior='height'
      keyboardVerticalOffset={5}
      style={styles.screen}
    >
      <LinearGradient
        colors={['firebrick', 'red', 'black']}
        style={styles.gradient}
      >
        <AuthCard style={styles.authContainer}>
          <ScrollView>
            <Input
              id='email'
              label='E-Mail'
              keyboardType='email-address'
              required
              email
              autoCapitalize='none'
              errorText='Please enter a valid email address'
              onInputChange={inputChangeHandler}
              initialValue=''
            />
            <Input
              id='password'
              label='Password'
              keyboardType='default'
              required
              secureTextEntry // to obscure the text
              minLength={5}
              autoCapitalize='none'
              errorText='Incorrect Password'
              onInputChange={inputChangeHandler}
              initialValue=''
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size='small' color={Colors.primary} />
              ) : (
                <Button
                  title={isSignUp ? 'Sign Up' : 'Login'}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignUp ? 'Login' : 'Sign Up'}`}
                color={Colors.highlight}
                onPress={() => {
                  setIsSignUp(!isSignUp)
                }}
              />
            </View>
          </ScrollView>
        </AuthCard>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

AuthScreen.navigationOptions = {
  headerTitle: 'Authenticate',
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    margin: 10,
  },
})

export default AuthScreen
