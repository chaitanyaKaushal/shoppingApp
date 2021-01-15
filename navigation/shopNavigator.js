import React from 'react'
import { Platform, SafeAreaView, Button, View } from 'react-native'
import { createStackNavigator } from 'react-navigation-stack'
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
//screens
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen'
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen'
import CartScreen from '../screens/shop/CartScreen'
import OrdersScreen from '../screens/shop/OrdersScreen'
import UserProductsScreen from '../screens/user/UserProductsScreen'
import EditProductScreen from '../screens/user/EditProductScreen'
import AuthScreen from '../screens/user/AuthScreen'
import StartupScreen from '../screens/StartupScreen'
import { useDispatch } from 'react-redux'
import * as authActions from '../centralstore/actions/auth'

const defaultNav = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : '',
  },
  headerTintColor: Platform.OS === 'android' ? Colors.accent : Colors.primary,
  headerTitleStyle: {
    textAlign: 'center',
    fontFamily: 'open-sans-bold',
  },
}

const productsNavigator = createStackNavigator(
  {
    ProductsOverview: ProductsOverviewScreen,
    ProductDetails: ProductDetailsScreen,
    Cart: CartScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNav,
  }
)

const OrdersNavigator = createStackNavigator(
  {
    Orders: OrdersScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNav,
  }
)

const AdminNavigator = createStackNavigator(
  {
    UserProducts: UserProductsScreen,
    EditProduct: EditProductScreen,
  },
  {
    navigationOptions: {
      drawerIcon: (drawerConfig) => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
          size={23}
          color={drawerConfig.tintColor}
        />
      ),
    },
    defaultNavigationOptions: defaultNav,
  }
)

const ShopNavigator = createDrawerNavigator(
  {
    Products: productsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.highlight,
    },
    contentComponent: (props) => {
      const dispatch = useDispatch()
      return (
        <View style={{ flex: 1, paddingTop: 30 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems {...props} />
            <Button
              title='Logout'
              color={Colors.primary}
              onPress={() => {
                dispatch(authActions.logout())
                // props.navigation.navigate('Auth')
              }}
            />
          </SafeAreaView>
        </View>
      )
    },
  }
)

const AuthNavigator = createStackNavigator(
  {
    Auth: AuthScreen,
  },
  {
    defaultNavigationOptions: defaultNav,
  }
)

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthNavigator,
  Shop: ShopNavigator,
})

export default createAppContainer(MainNavigator)
