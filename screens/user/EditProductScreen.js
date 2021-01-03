import React, { useState, useEffect, useCallback, useReducer } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native'
import Colors from '../../constants/Colors'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../../components/HeaderButton'
import { useSelector, useDispatch } from 'react-redux'
import * as productsActions from '../../centralstore/actions/products'
import Input from '../../components/Input'

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
        ...state,
        inputValues: updatedValues,
        inputValidities: updatedValidities,
        formIsValid: formIsValid,
      }

    default:
      return state
  }
}

const EditProductScreen = (props) => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const prodId = props.navigation.getParam('productId')
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  ) // if not in edit mode, then undefined

  //reducers are used when there are too many connected or complex states, so an optimized replacement of useState()
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : '', // to pre-populate existing product values
      imageUrl: editedProduct ? editedProduct.imgUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: '',
    },
    inputValidities: {
      // whether that input is valid or not
      title: editedProduct ? true : false, // input is valid if we are in edit mode because it was previously successfully submitted
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false, //is form valid overall when all states are valid
  })

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert(
        'Wrong Input(s)!',
        'Please check for the errors in the form',
        [{ text: 'Okay' }]
      )
      return
    }

    setError(null)
    setIsLoading(true)
    try {
      if (prodId) {
        // editing existing product
        await dispatch(
          productsActions.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl
          )
        )
      } else {
        // adding new Product
        await dispatch(
          productsActions.createProduct(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageUrl,
            +formState.inputValues.price
          )
        )
      }
      props.navigation.goBack()
    } catch (err) {
      setError(err)
    }
  }, [dispatch, formState])

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler })
  }, [submitHandler])

  useEffect(() => {
    if (error) {
      Alert.alert(`Error: ${error.name}`, error.message, [{ text: 'Okay' }])
    }
  })

  // Validating text

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      // // text is a default prop in onChangeText
      // let isValid = false
      // //this validation is valid for any input here
      // if (text.trim().length > 0) {
      //   // trims off the white spaces from left and right
      //   isValid = true
      // }
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      })
    },
    [dispatchFormState]
  )

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  }

  return (
    // <KeyboardAvoidingView
    //   style={{ flex: 1 }}
    //   behavior='padding'
    //   keyboardVerticalOffset={100}
    // >
    <ScrollView>
      <View style={styles.form}>
        <Input
          id='title'
          keyboardType='default'
          autoCapitalize='words'
          autoCorrect={false}
          returnKeyType='next'
          errorText='Please enter a valid title!'
          label='Title'
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.title : ''}
          required
        />
        <Input
          id='imageUrl'
          keyboardType='default'
          autoCapitalize='sentences'
          autoCorrect={false}
          returnKeyType='next'
          errorText='Please enter a URL!'
          label='Image URL'
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.imgUrl : ''}
          required
        />
        {editedProduct ? null : ( // to make sure not to edit the price when in edit mode and not in create new mode
          <Input
            id='price'
            keyboardType='decimal-pad'
            returnKeyType='next'
            errorText='Please enter a valid price!'
            label='Price'
            onInputChange={inputChangeHandler}
            // initialValue={editedProduct ? editedProduct.title : ''}
            required
            min={0.1}
          />
        )}
        <Input
          id='description'
          keyboardType='default'
          autoCapitalize='sentences'
          autoCorrect={false}
          returnKeyType='done'
          errorText='Please enter some description!'
          label='Description'
          multiline
          numberOfLines={3}
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.description : ''}
          required
          minLength={5}
        />
      </View>
    </ScrollView>
    // </KeyboardAvoidingView>
  )
}

EditProductScreen.navigationOptions = (navData) => {
  const submitFunction = navData.navigation.getParam('submit')
  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Edit Product'
      : 'Add Product',
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            onPress={submitFunction}
            iconName={Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark'}
            title='Submit'
          />
        </HeaderButtons>
      )
    },
  }
}

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default EditProductScreen
