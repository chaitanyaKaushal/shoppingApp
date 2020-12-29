import React from 'react'
import { FlatList, Text, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../../components/HeaderButton'
import { deleteProduct } from '../../centralstore/actions/products'

import Card from '../../components/Card'

const UserProductsScreen = (props) => {
  const userProducts = useSelector((state) => state.products.userProducts)

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      {
        text: 'No',
        style: 'default',
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(deleteProduct(id))
        },
      },
    ])
  }

  const editProductHandler = (productId) => {
    props.navigation.navigate({
      routeName: 'EditProduct',
      params: { productId: productId },
    })
  }

  const dispatch = useDispatch()
  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item, index) => item.id}
      renderItem={(itemData) => (
        <Card
          onSelectRightBtn={() => deleteHandler(itemData.item.id)}
          onSelectLeftBtn={() => {
            editProductHandler(itemData.item.id)
          }}
          title={itemData.item.title}
          imgUrl={itemData.item.imgUrl}
          price={itemData.item.price}
          leftText='Edit'
          rightText='Delete'
        />
      )}
    />
  )
}
UserProductsScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Your Products',
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
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            onPress={() => navData.navigation.navigate('EditProduct')}
            iconName={Platform.OS === 'ios' ? 'ios-create' : 'md-create'}
            title='Add'
          />
        </HeaderButtons>
      )
    },
  }
}
export default UserProductsScreen
