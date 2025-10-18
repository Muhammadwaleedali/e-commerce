import React, { useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkoutService } from "../services/checkoutService";
import { clearCart } from "../redux/cartSlice";

const Checkout = () => {
  const navigate = useNavigate();

  const [billingToggle, setBillingToggle] = useState(true);
  const [shippingToggle, setShippingToggle] = useState(false);
  const [paymentToggle, setPaymentToggle] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState("");
  const [orderData, setOrderData] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const cart = useSelector((state) => state.cart);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const dispatch = useDispatch();

  const handlePlaceOrder = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.zipCode ||
      (paymentMethod === "card" &&
        (!formData.cardHolder ||
          !formData.cardNumber ||
          !formData.expiry ||
          !formData.cvv))
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (!cart.items || cart.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    const order = {
      billingInfo: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      },
      shippingInfo: {
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
      },
      paymentInfo: {
        method: paymentMethod,
        ...(paymentMethod === "card"
          ? {
              cardHolder: formData.cardHolder,
              cardNumber: formData.cardNumber,
              expiry: formData.expiry,
              cvv: formData.cvv,
            }
          : {}),
      },
      cart: cart.items,
      total: cart.totalPrice ? cart.totalPrice.toFixed(2) : "0.00",
      orderNumber: orderNumber,
    };

    try {
      const orderPayload = {
        userId: "current-user-id",
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };

      await checkoutService.createOrder(orderPayload);
      await checkoutService.clearCart();
      dispatch(clearCart());

      const previousOrders = JSON.parse(localStorage.getItem("orders")) || [];
      const updatedOrders = [...previousOrders, order];
      localStorage.setItem("orders", JSON.stringify(updatedOrders));

      setOrderData(order);
      setError("");
      setOrderPlaced(true);
    } catch (err) {
      setError("Failed to place order. Please try again.");
      console.error("Place order error:", err);
    }
  };

  return (
    <div className="container mx-auto py-8 min-h-96 px-4 md:px-16 lg:px-24">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">CHECKOUT</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {orderPlaced && orderData ? (
        <div className="bg-green-100 border border-green-400 p-6 rounded-md">
          <h4 className="text-xl font-semibold text-green-800 mb-4">
            Order Placed Successfully!
          </h4>
          <p>
            <strong>Order Number:</strong> {orderData.orderNumber}
          </p>
          <p>
            <strong>Name:</strong> {orderData.billingInfo.name}
          </p>
          <p>
            <strong>Email:</strong> {orderData.billingInfo.email}
          </p>
          <p>
            <strong>Phone:</strong> {orderData.billingInfo.phone}
          </p>
          <p>
            <strong>Address:</strong> {orderData.shippingInfo.address},{" "}
            {orderData.shippingInfo.city}, {orderData.shippingInfo.zipCode}
          </p>
          <p>
            <strong>Payment Method:</strong>{" "}
            {orderData.paymentInfo.method === "card"
              ? "Card"
              : "Cash on Delivery"}
          </p>
          <p>
            <strong>Total:</strong> ${orderData.total}
          </p>

          <div className="mt-6 flex gap-4">
            <button
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={() =>
                alert(
                  `Order Number: ${orderData.orderNumber}\nYour order has been placed successfully.`
                )
              }
            >
              Track Order
            </button>
            <button
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row justify-between gap-10 mt-8">
          <div className="md:w-2/3 space-y-6">
            {/* Billing Information */}
            <div className="border p-4 rounded-md shadow-sm">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setBillingToggle(!billingToggle)}
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  Billing Information
                </h3>
                {billingToggle ? <FaAngleUp /> : <FaAngleDown />}
              </div>
              {billingToggle && (
                <div className="space-y-4 mt-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter Phone #"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Shipping Information */}
            <div className="border p-4 rounded-md shadow-sm">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShippingToggle(!shippingToggle)}
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  Shipping Information
                </h3>
                {shippingToggle ? <FaAngleUp /> : <FaAngleDown />}
              </div>
              {shippingToggle && (
                <div className="space-y-4 mt-4">
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter Address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    placeholder="Enter Zip Code"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="border p-4 rounded-md shadow-sm">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setPaymentToggle(!paymentToggle)}
              >
                <h3 className="text-lg font-semibold text-gray-700">
                  Payment Method
                </h3>
                {paymentToggle ? <FaAngleUp /> : <FaAngleDown />}
              </div>
              {paymentToggle && (
                <div className="space-y-4 mt-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <label className="text-gray-700">Cash on Delivery</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <label className="text-gray-700">Debit/Credit Card</label>
                  </div>
                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="cardHolder"
                        placeholder="Card Holder Name"
                        value={formData.cardHolder}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card Number"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-md"
                      />
                      <div className="flex gap-4">
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={formData.expiry}
                          onChange={handleInputChange}
                          className="w-1/2 px-3 py-2 border rounded-md"
                        />
                        <input
                          type="text"
                          name="cvv"
                          placeholder="CVV"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-1/2 px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:w-1/3 bg-white p-6 rounded-xl shadow-md border mt-8 md:mt-0">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Order Summary
            </h3>
            <div className="space-y-4">
              {cart.items &&
                cart.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 border-b pb-3 last:border-b-0"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div className="flex flex-col">
                      <h4 className="text-gray-900 font-medium">
                        {item.name}
                        <span className="ml-24">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </h4>
                      <p className="text-gray-600 text-sm">
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <span className="text-lg font-medium text-gray-700">
                Total price
              </span>
              <span className="text-lg font-semibold text-gray-800">
                ${cart.totalPrice ? cart.totalPrice.toFixed(2) : "0.00"}
              </span>
            </div>
            <div className="mt-6">
              <button
                onClick={handlePlaceOrder}
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                disabled={!cart.items || cart.items.length === 0}
              >
                Place order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
