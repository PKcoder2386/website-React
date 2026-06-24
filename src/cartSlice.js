import { createSlice } from "@reduxjs/toolkit";
const loadCart = () => {
  try {
    const data = localStorage.getItem("cartItems");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
const initialState = {
  cartItems: loadCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const itemInCart = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (itemInCart) {
        itemInCart.quantity += 1;
      } else {
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    decreaseQuantity(state, action) {
      const item = state.cartItems.find(
        (item) => item.id === action.payload.id
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter(
            (i) => i.id !== action.payload.id
          );
        }
      }
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeFromCart(state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    clearCart(state) {
      state.cartItems = [];
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
  },
});
export const { addToCart, decreaseQuantity, removeFromCart, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
