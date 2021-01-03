import React, { useEffect, useState, useCallback } from 'react'
import {
  FlatList,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  ActivityIndicatorBase,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../../components/HeaderButton'
import OrderItem from '../../components/OrderItem'
import * as orderActions from '../../centralstore/actions/order'
import Colors from '../../constants/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const OrdersScreen = (props) => {
  const orders = useSelector((state) => state.order.orders)
  orders.sort((a, b) => (a.readableDate > b.readableDate ? 1 : -1))

  const loadedOrders = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      await dispatch(orderActions.fetchOrders())
    } catch (err) {
      setError(err.message)
    }
    setIsLoading(false)
  }, [dispatch])

  const dispatch = useDispatch()
  useEffect(() => {
    loadedOrders()
  }, [dispatch, loadedOrders])

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  if (error) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons
          name='emoticon-dead'
          size={80}
          color='firebrick'
          style={{ margin: 20 }}
        />
        <Text style={{ fontFamily: 'open-sans-bold', fontSize: 16 }}>
          {error}
        </Text>
        <MaterialCommunityIcons
          name='refresh-circle'
          size={40}
          color={Colors.primary}
          style={{ margin: 20 }}
          onPress={() => loadedOrders()}
        />
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size='large' color={Colors.primary} />
      </View>
    )
  }

  if (!isLoading && orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No orders found. Maybe start ordering some!</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item, index) => item.id}
      renderItem={(itemData) => (
        <OrderItem
          totalAmount={itemData.item.totalAmount}
          date={itemData.item.readableDate}
          items={itemData.item.items}
        />
      )}
    />
  )
}

OrdersScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Your Orders',
    headerLeft: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            onPress={() => navData.navigation.toggleDrawer()}
            iconName={Platform.OS === 'ios' ? 'ios-menu' : 'md-menu'}
            title='Menu'
          />
        </HeaderButtons>
      )
    },
  }
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
})

export default OrdersScreen
