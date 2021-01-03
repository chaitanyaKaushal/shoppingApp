export const DELETE_PRODUCT = 'DELETE_PRODUCT'
export const CREATE_PRODUCT = 'CREATE_PRODUCT'
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT'
export const SET_PRODUCTS = 'SET_PRODUCTS'
import { Product } from '../../models/product'

export const fetchProducts = () => {
  return async (dispatch) => {
    try {
      const resp = await fetch(
        'https://shopping-app-firebase-default-rtdb.firebaseio.com/products.json'
      )
      if (!resp.ok) {
        //could do what is wrong here... but i am throwing an error
        throw new Error('Something went wrong!')
      }
      const resData = await resp.json()
      const loadedProducts = []

      for (const key in resData) {
        loadedProducts.push(
          new Product(
            key,
            'u1',
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        )
      }

      dispatch({ type: SET_PRODUCTS, products: loadedProducts })
    } catch (err) {
      //send to custom analytics server
      throw err
    }
  }
}

export const deleteProduct = (productId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `https://shopping-app-firebase-default-rtdb.firebaseio.com/products/${productId}.json`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error('Something went wrong!')
      }

      dispatch({ type: DELETE_PRODUCT, pid: productId })
    } catch (err) {
      throw err
    }
  }
}

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch) => {
    //any async code you want!
    const resp = await fetch(
      'https://shopping-app-firebase-default-rtdb.firebaseio.com/products.json',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, imageUrl, price }),
      }
    )

    const resData = await resp.json() //unpacks response and gives data returned by Firebase after creating a product
    // console.log(resData)

    if (!resp.ok) {
      return new Error('Something went wrong!')
    }

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: resData.name,
        title: title,
        description: description,
        imgUrl: imageUrl,
        price: price,
      },
    })
  }
}

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch) => {
    //async code comes here

    const response = await fetch(
      `https://shopping-app-firebase-default-rtdb.firebaseio.com/products/${id}.json`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, imageUrl }),
      }
    )

    if (!response.ok) {
      return new Error('Something went wrong!')
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title: title,
        description: description,
        imgUrl: imageUrl,
      },
    })
  }
}
