export const ADD_ORDER = 'ADD_ORDER'
export const SET_ORDERS = 'SET_ORDERS'
import Order from '../../models/order'

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    try {
      const userId = getState().auth.userId
      const resp = await fetch(
        `https://shopping-app-firebase-default-rtdb.firebaseio.com/orders/${userId}.json`
      )
      if (!resp.ok) {
        //could do what is wrong here... but i am throwing an error
        throw new Error('Something went wrong!')
      }
      const resData = await resp.json()
      const loadedOrders = []

      for (const key in resData) {
        loadedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        )
      }
      dispatch({ type: SET_ORDERS, orders: loadedOrders })
    } catch (err) {
      //send to custom analytics server
      throw err
    }
  }
}

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token
    const userId = getState().auth.userId
    //any async code you want!
    const date = new Date().toISOString()
    const resp = await fetch(
      `https://shopping-app-firebase-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date,
        }),
      }
    )

    const resData = await resp.json() //unpacks response and gives data returned by Firebase after creating a product
    // console.log(resData)

    if (!resp.ok) {
      return new Error('Something went wrong!')
    }

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        items: cartItems,
        totalAmount: totalAmount,
        date: date,
      },
    })
  }
}
