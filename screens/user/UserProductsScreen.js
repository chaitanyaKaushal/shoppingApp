import React, { useState, useEffect, useCallback } from 'react'
import {
  FlatList,
  Text,
  Alert,
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import HeaderButton from '../../components/HeaderButton'
import { deleteProduct } from '../../centralstore/actions/products'
import { fetchProducts } from '../../centralstore/actions/products'
import Card from '../../components/Card'
import Colors from '../../constants/Colors'

const UserProductsScreen = (props) => {
  const userProducts = useSelector((state) => state.products.userProducts)

  const dispatch = useDispatch()
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const deleteHandlerButton = async (id) => {
    setIsLoading(true)
    setError(null)
    try {
      await dispatch(deleteProduct(id))
    } catch (err) {
      setError(err)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (error) {
      Alert.alert(error.name, error.message, [
        { text: 'OK', style: 'destructive' },
      ])
    }
  }, [error])

  const deleteHandler = (id) => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      {
        text: 'No',
        style: 'default',
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => deleteHandlerButton(id),
      },
    ])
  }
  /////
  const loadProducts = useCallback(async () => {
    setError(null)
    setIsLoading(true)
    try {
      await dispatch(fetchProducts())
    } catch (err) {
      setError(err)
    }
    setIsLoading(false)
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
    loadProducts()
  }, [dispatch, loadProducts])
  /////
  const editProductHandler = (productId) => {
    props.navigation.navigate({
      routeName: 'EditProduct',
      params: { productId: productId },
    })
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{`Error: ${error.name}`}</Text>
        <Text>{error.message}</Text>
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

  if (!isLoading && userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products found. Maybe start adding some!</Text>
      </View>
    )
  }

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

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
})

export default UserProductsScreen
