import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { useEffect } from "react";
import { apiCreateOrder } from "../apis/product";
import sweetAlert from "sweetalert2";
import { useNavigate } from "react-router-dom";

// This value is from the props in the UI
const style = { layout: "vertical" };

// Custom component to wrap the PayPalButtons and show loading spinner
const ButtonWrapper = ({ currency, showSpinner, amount, payload }) => {
  const navigate = useNavigate();
  const [{ isPending, options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency,
      },
    });
  }, [currency, showSpinner]);

  const handleSaveInformation = async () => {
    const response = await apiCreateOrder({
      ...payload,
      status: "Đang xử lý",
    });
    if (response.success) {
      setTimeout(() => {
        sweetAlert
          .fire({
            icon: "success",
            title: "Thành công",
            text: "Đơn hàng của bạn đang được xử lý!",
            showConfirmButton: false,
            timer: 3000,
          })
          .then((rs) => {
            navigate(`/`);
            window.location.reload();
            setTimeout(() => {
              window.scrollTo(0, 0);
            }, 100);
          });
      }, 1500);
    }
  };

  return (
    <>
      {showSpinner && isPending && <div className="spinner" />}
      <PayPalButtons
        style={style}
        disabled={false}
        forceReRender={[style, currency, amount]}
        fundingSource={undefined}
        createOrder={(data, actions) =>
          actions.order
            .create({
              purchase_units: [
                { amount: { currency_code: currency, value: amount } },
              ],
            })
            .then((orderId) => orderId)
        }
        onApprove={(data, actions) =>
          actions.order.capture().then(async (response) => {
            if (response.status === "COMPLETED") {
              handleSaveInformation();
            }
          })
        }
      />
    </>
  );
};

export default function Payment({ amount, payload }) {
  return (
    <div
      style={{
        maxWidth: "750px",
        minHeight: "200px",
        zIndex: 0,
        position: "relative",
      }}
    >
      <PayPalScriptProvider
        options={{ clientId: "test", components: "buttons", currency: "USD" }}
      >
        <ButtonWrapper
          payload={payload}
          currency={"USD"}
          amount={amount}
          showSpinner={true}
        />
      </PayPalScriptProvider>
    </div>
  );
}
