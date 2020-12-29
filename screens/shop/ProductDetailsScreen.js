import React, { useEffect } from 'react'
import { ScrollView, View, Text, Image, Button, StyleSheet } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import * as cartActions from '../../centralstore/actions/cart'
import Colors from '../../constants/Colors'

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam('productId')
  const selectedProduct = useSelector((state) =>
    state.products.availableProducts.find((product) => product.id === productId)
  )
  const dispatch = useDispatch()
  useEffect(() => {
    props.navigation.setParams({ title: selectedProduct.title })
  }, [selectedProduct.title])

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imgUrl }} />
      <View style={styles.actions}>
        <Button
          color={Colors.primary}
          title='Add to Cart'
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct))
          }}
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  )
}

ProductDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam('title'),
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    color: Colors.highlight,
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20,
    fontFamily: 'open-sans',
  },
})

export default ProductDetailScreen
