import Order from '../../models/order'
import { ADD_ORDER } from '../actions/order'

const initialState = {
  orders: [],
}

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_ORDER:
      const newOrder = new Order(
        new Date().getSeconds().toString(),
        action.orderData.items,
        action.orderData.totalAmount,
        new Date()
      )
      return { ...state, orders: [...state.orders, newOrder] }

    default:
      return state
  }
}
export default orderReducer
