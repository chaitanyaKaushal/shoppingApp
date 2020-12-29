import React from 'react'
import { FlatList, Platform } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Card from '../../components/Card'
import ProductDetailsScreen from '../shop/ProductDetailsScreen'
import * as cartActions from '../../centralstore/actions/cart'
import HeaderButton from '../../components/HeaderButton'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'

const ProductsOverviewScreen = (props) => {
  const products = useSelector((state) => state.products.availableProducts)
  const dispatch = useDispatch()

  const renderItemList = (itemData) => {
    return (
      <Card
        title={itemData.item.title}
        imgUrl={itemData.item.imgUrl}
        price={itemData.item.price}
        onSelectLeftBtn={() => {
          props.navigation.navigate({
            routeName: 'ProductDetails',
            params: { productId: itemData.item.id },
          })
        }}
        onSelectRightBtn={() => {
          dispatch(cartActions.addToCart(itemData.item))
        }}
        leftText='View Details'
        rightText='Add to Cart'
      />
    )
  }
  return (
    <FlatList
      data={products}
      renderItem={renderItemList}
      keyExtractor={(item, index) => item.id}
    />
  )
}

ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: 'Products Overview',
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            onPress={() => {
              navData.navigation.navigate('Cart')
            }}
            iconName={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
            title='Cart'
          />
        </HeaderButtons>
      )
    },
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

export default ProductsOverviewScreen
