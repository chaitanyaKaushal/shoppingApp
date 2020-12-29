import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Alert,
} from 'react-native'
import Colors from '../../constants/Colors'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../../components/HeaderButton'
import { useSelector, useDispatch } from 'react-redux'
import * as productsActions from '../../centralstore/actions/products'

const EditProductScreen = (props) => {
  const dispatch = useDispatch()

  const prodId = props.navigation.getParam('productId')
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  ) // if not in edit mode, then undefined
  const [title, setTitle] = useState(editedProduct ? editedProduct.title : '')
  const [imageUrl, setImageUrl] = useState(
    editedProduct ? editedProduct.imgUrl : ''
  )
  const [price, setPrice] = useState(editedProduct ? editedProduct.price : '')
  const [description, setDescription] = useState(
    editedProduct ? editedProduct.description : ''
  )

  const submitHandler = useCallback(() => {
    if (prodId) {
      // editing existing product
      dispatch(
        productsActions.updateProduct(prodId, title, description, imageUrl)
      )
    } else {
      // adding new Product
      dispatch(
        productsActions.createProduct(title, description, imageUrl, +price)
      )
    }
    props.navigation.goBack()
  }, [prodId, title, description, imageUrl, price, dispatch])

  useEffect(() => {
    props.navigation.setParams({ submit: submitHandler })
  }, [submitHandler])

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={(text) => setTitle(text)}
          />
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={imageUrl}
            onChangeText={(text) => setImageUrl(text)}
          />
        </View>
        {editedProduct ? null : ( // to make sure not to edit the price when in edit mode and not in create new mode
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={(text) => setPrice(text)}
            />
          </View>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
        </View>
      </View>
    </ScrollView>
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
  formControl: {
    width: '100%',
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
})

export default EditProductScreen
