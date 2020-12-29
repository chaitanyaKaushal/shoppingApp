import React from 'react'
import { Text, View, StyleSheet } from 'react-native'
import Colors from '../constants/Colors'

const CartItem = (props) => {
  return (
    <View style={styles.cnt}>
      <Text style={styles.titleContent}>{props.productTitle}</Text>
      <Text style={styles.quantityContent}>
        {'   '}x{props.quantity}
      </Text>
      <Text style={styles.sumContent}>
        {'   '}${props.sum.toFixed(2)}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cnt: {
    backgroundColor: Colors.accent,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10,
    alignItems: 'center',
    width: '100%',
    margin: 5,
  },
  titleContent: {
    color: 'black',
    fontFamily: 'open-sans-bold',
    fontSize: 15,
  },
  quantityContent: {
    color: '#888',
    fontFamily: 'open-sans-bold',
  },
  sumContent: {
    color: Colors.highlight,
    fontFamily: 'open-sans-bold',
  },
})

export default CartItem
