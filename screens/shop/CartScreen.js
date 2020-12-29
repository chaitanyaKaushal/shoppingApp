import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Button,
  TouchableOpacity,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Colors from '../../constants/Colors'
import ButtonComponent from '../../components/ButtonComponent'
import { Ionicons } from '@expo/vector-icons'
import { removeFromCart } from '../../centralstore/actions/cart'
import { addOrder } from '../../centralstore/actions/order'

const CartScreen = (props) => {
  const dispatch = useDispatch()

  const renderItemHandle = (itemData) => {
    return (
      <View style={styles.container}>
        <View style={styles.cnt}>
          <Text style={styles.titleContent}>{itemData.item.productTitle}</Text>
          <Text style={styles.quantityContent}>x{itemData.item.quantity}</Text>
          <Text style={styles.sumContent}>${itemData.item.sum.toFixed(2)}</Text>
          <TouchableOpacity
            onPress={() => {
              dispatch(removeFromCart(itemData.item.productId))
            }}
          >
            <Ionicons name='trash' size={23} color='firebrick' />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const cartTotalAmount = useSelector((state) => state.cart.totalAmount)
  const cartItems = useSelector((state) => state.cart.items)

  let cartItemsList = []
  for (const key in cartItems) {
    cartItemsList.push({
      productId: key,
      quantity: cartItems[key].quantity,
      productPrice: cartItems[key].productPrice,
      productTitle: cartItems[key].productTitle,
      sum: cartItems[key].sum,
    })
  }
  cartItemsList.sort((a, b) => (a.productId > b.productId ? 1 : -1))
  return (
    <View style={styles.screen}>
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total Amount:
          <Text style={styles.amount}>
            {' '}
            ${Math.round(cartTotalAmount.toFixed(2) * 100) / 100}
            {/* To deal with -0.00 */}
          </Text>
        </Text>
        <ButtonComponent
          text='Order Now'
          onPress={() => {
            dispatch(addOrder(cartItemsList, cartTotalAmount))
          }}
          disabled={cartItemsList.length === 0}
        />
      </View>
      <View>
        <Text style={styles.heading}>CART ITEMS</Text>
        <FlatList
          data={cartItemsList}
          renderItem={renderItemHandle}
          keyExtractor={(item, index) => item.productId}
        />
      </View>
    </View>
  )
}

CartScreen.navigationOptions = {
  headerTitle: 'Your Cart',
}

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    padding: 10,
    elevation: 10,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.26,
    shadowRadius: 8,
  },
  amount: {
    color: Colors.highlight,
  },
  summaryText: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
  },
  content: {
    color: Colors.highlight,
    fontFamily: 'open-sans',
  },
  heading: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'open-sans-bold',
    margin: 20,
  },
  container: {
    margin: 10,
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  cnt: {
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    alignItems: 'center',
  },
  titleContent: {
    color: 'black',
    fontFamily: 'open-sans-bold',
    fontSize: 15,
  },
  quantityContent: {
    color: 'black',
    fontFamily: 'open-sans-bold',
  },
  sumContent: {
    color: Colors.highlight,
    fontFamily: 'open-sans-bold',
  },
})

export default CartScreen
