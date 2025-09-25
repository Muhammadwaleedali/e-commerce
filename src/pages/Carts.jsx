import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import EmptyCart from "../components/image/emptyCart.png";
import { FaTrashAlt } from "react-icons/fa";
import Modal from "../components/Modal";
import ChangeAddress from "../components/ChangeAddress";
import {
  updateQuantityAsync,
  removeFromCartAsync,
  fetchCart,
} from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const Carts = () => {
  const cart = useSelector((state) => state.cart);
  const [address, setAddress] = useState("main street, 122");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleIncreaseQuantity = (productId, currentQuantity) => {
    dispatch(updateQuantityAsync({ productId, quantity: currentQuantity + 1 }));
  };

  const handleDecreaseQuantity = (productId, currentQuantity) => {
    if (currentQuantity > 1) {
      dispatch(
        updateQuantityAsync({ productId, quantity: currentQuantity - 1 })
      );
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCartAsync(productId));
  };

  if (cart.loading) {
    return <div className="text-center py-8">Loading cart...</div>;
  }

  if (cart.error) {
    return <div className="text-center py-8 text-red-600">{cart.error}</div>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="flex justify-center">
        <img src={EmptyCart} alt="Empty Cart" className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 min-h-96 px-4 md:px-16 lg:px-24">
      <div>
        <h3 className="text-2xl font-semibold mb-4">SHOPPING CART</h3>
        <div className="flex flex-col md:flex-row justify-between gap-10 mt-8">
          <div className="md:w-2/3">
            <div className="flex justify-between border-b items-center mb-4 text-xs font-bold">
              <p>PRODUCTS</p>
              <div className="flex space-x-8">
                <p>PRICE</p>
                <p>QUANTITY</p>
                <p>SUBTOTAL</p>
                <p>REMOVE</p>
              </div>
            </div>
            {cart.items.map((product) => (
              <div
                key={product.productId}
                className="flex items-center justify-between p-3 border-b"
              >
                <div className="md:flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-contain rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                  </div>
                </div>
                <div className="flex space-x-12 items-center">
                  <p className="text-sm">${product.price}</p>
                  <div className="flex items-center justify-center border">
                    <button
                      className="text-xl font-bold px-1.5 border-r"
                      onClick={() =>
                        handleDecreaseQuantity(
                          product.productId,
                          product.quantity
                        )
                      }
                    >
                      -
                    </button>
                    <p className="text-xl px-2">{product.quantity}</p>
                    <button
                      className="text-xl px-1 border-l"
                      onClick={() =>
                        handleIncreaseQuantity(
                          product.productId,
                          product.quantity
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm">
                    ${(product.quantity * product.price).toFixed(2)}
                  </p>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem(product.productId)}
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="md:w-1/3 bg-white p-6 rounded-lg shadow-md border mt-8 md:mt-0">
            <h3 className="text-sm font-semibold mb-5">CART TOTAL:</h3>
            <div className="flex justify-between mb-4 text-sm font-semibold">
              <span>TOTAL ITEMS:</span>
              <span className="ml-20">{cart.totalQuantity}</span>
            </div>
            <div className="mb-4 border-b pb-2 text-sm">
              <p>Shipping:</p>
              <p className="ml-2">
                Shipping to:
                <span className="text-s font-bold">{address}</span>
              </p>
              <button
                className="text-blue-500 hover:underline mt-1 ml-2"
                onClick={() => setIsModelOpen(true)}
              >
                Change Address
              </button>
            </div>
            <div className="flex justify-between mb-4 text-sm font-semibold">
              <span>Total Price:</span>
              <span>${cart.totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="w-full bg-red-600 text-white py-2 hover:bg-red-800"
              onClick={() => navigate("/checkout")}
            >
              Proceed to checkout
            </button>
          </div>
        </div>
        <Modal isModelOpen={isModelOpen} setIsModelOpen={setIsModelOpen}>
          <ChangeAddress
            setAddress={setAddress}
            setIsModelOpen={setIsModelOpen}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Carts;
