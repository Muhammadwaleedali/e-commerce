import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../axios";

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/cart");
      return response.data;
    } catch (err) {
      console.error("Fetch cart error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async (product, { rejectWithValue }) => {
    try {
      // Ensure we have valid data
      if (!product._id && !product.id) {
        throw new Error("Product ID is required");
      }

      // Handle image path
      let imagePath = product.image;
      if (typeof product.image !== 'string' && product.image.src) {
        imagePath = product.image.src;
      }

      const cartItem = {
        productId: product._id || product.id,
        name: product.name || product.title,
        price: parseFloat(product.price || 0),
        image: imagePath,
        quantity: 1
      };

      // Log the normalized item for debugging
      console.log("Adding to cart:", cartItem);

      const response = await axios.post("/api/cart/add", cartItem);
      return response.data;
    } catch (err) {
      console.error("Add to cart error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to add item to cart"
      );
    }
  }
);

export const updateQuantityAsync = createAsyncThunk(
  "cart/updateQuantity",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put("/api/cart/quantity", {
        productId,
        quantity: parseInt(quantity, 10),
      });
      return response.data;
    } catch (err) {
      console.error("Update quantity error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to update quantity"
      );
    }
  }
);

export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/cart/remove/${productId}`);
      return response.data;
    } catch (err) {
      console.error("Remove from cart error:", err.response?.data || err.message);
      return rejectWithValue(
        err.response?.data?.message || "Failed to remove item"
      );
    }
  }
);

const initialState = {
  items: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCartAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(addToCartAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Quantity
      .addCase(updateQuantityAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
        state.totalPrice = action.payload.totalPrice || 0;
      })
      // Remove from Cart
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.totalQuantity = action.payload.totalQuantity || 0;
        state.totalPrice = action.payload.totalPrice || 0;
      });
  },
});

export const { clearCart, setError } = cartSlice.actions;
export default cartSlice.reducer; 