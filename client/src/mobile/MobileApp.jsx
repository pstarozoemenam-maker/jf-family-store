import { Navigate, Route, Routes } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import MobileLayout from "./MobileLayout";
import {
  MobileCart,
  MobileCheckout,
  MobileHome,
  MobileOrderConfirmation,
  MobileProduct,
  MobileShop,
  MobileWishlist,
} from "./MobilePages";
import { MobileLogin, MobileSignup } from "./MobileAuth";
import {
  MobileChangePassword,
  MobileDelivered,
  MobileMore,
  MobileOrders,
  MobileProfile,
} from "./MobileAccount";
import {
  MobileAbout,
  MobileContact,
  MobileFaq,
  MobileNotFound,
} from "./MobileInfo";

export default function MobileApp() {
  const { cartCount, currentUser, toast } = useStore();

  return (
    <>
      <div className={`m-toast ${toast ? "show" : ""}`} role="status">
        {toast}
      </div>
      <Routes>
      <Route element={<MobileLayout cartCount={cartCount} currentUser={currentUser} />}>
        <Route path="/m" element={<MobileHome />} />
        <Route path="/m/shop" element={<MobileShop />} />
        <Route path="/m/product" element={<MobileProduct />} />
        <Route path="/m/cart" element={<MobileCart />} />
        <Route path="/m/wishlist" element={<MobileWishlist />} />
        <Route path="/m/checkout" element={<MobileCheckout />} />
        <Route path="/m/order-confirmation" element={<MobileOrderConfirmation />} />
        <Route path="/m/login" element={<MobileLogin />} />
        <Route path="/m/signup" element={<MobileSignup />} />
        <Route path="/m/profile" element={<MobileProfile />} />
        <Route path="/m/more" element={<MobileMore />} />
        <Route path="/m/orders" element={<MobileOrders />} />
        <Route path="/m/delivered" element={<MobileDelivered />} />
        <Route path="/m/change-password" element={<MobileChangePassword />} />
        <Route path="/m/about" element={<MobileAbout />} />
        <Route path="/m/contact" element={<MobileContact />} />
        <Route path="/m/faq" element={<MobileFaq />} />
        <Route path="/m/*" element={<MobileNotFound />} />
        <Route path="*" element={<Navigate to="/m" replace />} />
      </Route>
    </Routes>
    </>
  );
}
