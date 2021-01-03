import Order from '../../models/order'
import { ADD_ORDER } from '../actions/order'
import { SET_ORDERS } from '../actions/order'

const initialState = {
  orders: [],
}

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER:
      const newOrder = new Order(
        action.orderData.id,
        action.orderData.items,
        action.orderData.totalAmount,
        action.orderData.date
      )
      return { ...state, orders: [...state.orders, newOrder] }
    case SET_ORDERS:
      return {
        orders: action.orders,
      }
    default:
      return state
  }
}
export default orderReducer
