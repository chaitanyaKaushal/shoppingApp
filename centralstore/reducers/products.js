import PRODUCTS from '../../data/dummy-data'
import { Product } from '../../models/product'
import { DELETE_PRODUCT } from '../actions/products'
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../actions/products'

const initialState = {
  availableProducts: PRODUCTS,
  userProducts: PRODUCTS.filter((product) => product.ownerId === 'u1'),
}

const productsReducers = (state = initialState, action) => {
  switch (action.type) {
    case DELETE_PRODUCT:
      return {
        ...state,
        availableProducts: state.availableProducts.filter(
          (prod) => prod.id !== action.pid
        ),
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.pid
        ),
      }
    case CREATE_PRODUCT:
      const newProduct = new Product(
        new Date().getSeconds().toString(),
        'u1',
        action.productData.title,
        action.productData.imgUrl,
        action.productData.description,
        action.productData.price
      )
      return {
        ...state,
        availableProducts: state.availableProducts.concat(newProduct),
        userProducts: state.userProducts.concat(newProduct),
      }
    case UPDATE_PRODUCT:
      const prodIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.pid
      )
      const updatedProduct = new Product(
        action.pid,
        state.userProducts[prodIndex].ownerId,
        action.productData.title,
        action.productData.imgUrl,
        action.productData.description,
        state.userProducts[prodIndex].price
      )

      const updatedUserProducts = [...state.userProducts]

      updatedUserProducts[prodIndex] = updatedProduct

      const availableProductIndex = state.availableProducts.findIndex(
        (prod) => prod.id === action.pid
      )

      const updatedAvailableProducts = [...state.availableProducts]
      updatedAvailableProducts[availableProductIndex] = updatedProduct

      return {
        ...state,
        availableProducts: updatedAvailableProducts,
        userProducts: updatedUserProducts,
      }

    default:
      return state
  }
}

export default productsReducers
