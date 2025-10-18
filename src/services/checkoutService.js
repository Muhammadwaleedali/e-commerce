import { orderAPI, cartAPI } from '../api/endpoints';

export const checkoutService = {
  async createOrder(orderData) {
    try {
      const response = await orderAPI.create(orderData);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  async processCheckout(checkoutData) {
    try {
      const response = await orderAPI.checkout(checkoutData);
      return response.data;
    } catch (error) {
      console.error('Checkout error:', error);
      throw error;
    }
  },

  async clearCart() {
    try {
      const response = await cartAPI.clear();
      return response.data;
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  }
};