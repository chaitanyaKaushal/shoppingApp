import React, { useState } from 'react'
import { View, Text, StyleSheet, Button } from 'react-native'
import Colors from '../constants/Colors'
import ButtonComponent from './ButtonComponent'
import CartItem from './CartItem'

const OrderItem = (props) => {
  const [showDetails, setShowDetails] = useState(false)
  return (
    <View style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>${props.totalAmount.toFixed(2)}</Text>
        <Text>{props.date}</Text>
      </View>
      <Button
        color={Colors.primary}
        title={!showDetails ? 'Show Details' : 'Hide Details'}
        onPress={() => setShowDetails((prevState) => !prevState)}
      />
      {showDetails && (
        <View>
          {props.items.map((item) => (
            <CartItem
              key={item.productId}
              productTitle={item.productTitle}
              sum={item.sum}
              quantity={item.quantity}
            />
          ))}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  orderItem: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    margin: 20,
    padding: 10,
    alignItems: 'center',
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    margin: 15,
  },
  totalAmount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16,
  },
  date: {
    fontSize: 16,
    fontFamily: 'open-sans-bold',
    color: '#888',
  },
})
export default OrderItem
