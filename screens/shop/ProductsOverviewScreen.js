import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  FlatList,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Card from '../../components/Card'
import ProductDetailsScreen from '../shop/ProductDetailsScreen'
import * as cartActions from '../../centralstore/actions/cart'
import HeaderButton from '../../components/HeaderButton'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { fetchProducts } from '../../centralstore/actions/products'
import Colors from '../../constants/Colors'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const products = useSelector((state) => state.products.availableProducts)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const dispatch = useDispatch()

  const loadProducts = useCallback(async () => {
    setError(null)
    setIsRefreshing(true)
    try {
      await dispatch(fetchProducts())
    } catch (err) {
      setError(err.message)
    }
    setIsRefreshing(false)
  }, [dispatch])

  useEffect(() => {
    const willFocusSub = props.navigation.addListener('willFocus', () => {
      loadProducts()
    })
    return () => {
      willFocusSub.remove()
    }
  }, [loadProducts])

  useEffect(() => {
    setIsLoading(true)
    loadProducts().then(() => setIsLoading(false))
  }, [dispatch, loadProducts])

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
          onPress={() => loadProducts()}
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

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={products}
      renderItem={renderItemList}
      keyExtractor={(item, index) => item.id}
      onRefresh={loadProducts}
      refreshing={isRefreshing}
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

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
})

export default ProductsOverviewScreen
