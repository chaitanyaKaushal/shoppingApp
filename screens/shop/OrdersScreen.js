import React from 'react'
import { FlatList, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../../components/HeaderButton'
import OrderItem from '../../components/OrderItem'

const OrdersScreen = (props) => {
  const orders = useSelector((state) => state.order.orders)
  orders.sort((a, b) => (a.id < b.id ? 1 : -1))
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

export default OrdersScreen
