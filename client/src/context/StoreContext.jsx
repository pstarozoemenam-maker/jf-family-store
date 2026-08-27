import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { defaultProducts } from "../data/products";

const StoreContext = createContext(null);

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const storedValue = window.localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      return;
    }
  }, [key, value]);

  return [value, setValue];
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(defaultProducts);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useStoredState("cart", []);
  const [wishlist, setWishlist] = useStoredState("wishlist", []);
  const [currentUser, setCurrentUser] = useStoredState("user", null);
  const [toast, setToast] = useState("");
  const [lastOrder, setLastOrder] = useState(null);

  const refreshProducts = useCallback(async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Product request failed");

      const data = await response.json();
      if (Array.isArray(data) && data.length) {
        setProducts(data);
      }
    } catch (error) {
      console.error(error);
      setProducts(defaultProducts);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    refreshProducts()
      .catch(() => {
        if (isMounted) {
          setProducts(defaultProducts);
          setToast("Showing local product list.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refreshProducts]);

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  const addToCart = useCallback(
    (id) => {
      if (!currentUser) {
        showToast("Please log in to add products to your cart.");
        return;
      }

      setCart((previousCart) => {
        const existingItem = previousCart.find((item) => item.id === id);
        if (existingItem) {
          return previousCart.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }
        return [...previousCart, { id, quantity: 1 }];
      });
      showToast("Added to cart");
    },
    [currentUser, setCart, showToast],
  );

  const removeFromCart = useCallback(
    (id) => {
      setCart((previousCart) =>
        previousCart.filter((item) => item.id !== id),
      );
    },
    [setCart],
  );

  const updateQuantity = useCallback(
    (id, change) => {
      setCart((previousCart) =>
        previousCart
          .map((item) =>
            item.id === id
              ? { ...item, quantity: item.quantity + change }
              : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    [setCart],
  );

  const toggleWishlist = useCallback(
    (id) => {
      setWishlist((previousWishlist) => {
        if (previousWishlist.includes(id)) {
          showToast("Removed from wishlist");
          return previousWishlist.filter((item) => item !== id);
        }

        showToast("Added to wishlist");
        return [...previousWishlist, id];
      });
    },
    [setWishlist, showToast],
  );

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!data.success) {
          showToast(data.message || "Invalid email or password");
          return false;
        }

        setCurrentUser(data.user);
        showToast("Login successful");
        return true;
      } catch (error) {
        console.error(error);
        showToast("Login failed");
        return false;
      }
    },
    [setCurrentUser, showToast],
  );

  const signup = useCallback(
    async (name, email, password) => {
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        if (!data.success) {
          showToast(data.message || "Signup failed");
          return false;
        }

        showToast("Account created successfully");
        return true;
      } catch (error) {
        console.error(error);
        showToast("Signup failed");
        return false;
      }
    },
    [showToast],
  );

  const logout = useCallback(() => {
    setCurrentUser(null);
    showToast("Logged out");
  }, [setCurrentUser, showToast]);

  const cartTotal = useMemo(
    () =>
      cart.reduce((total, item) => {
        const product = products.find((entry) => entry.id === Number(item.id));
        return total + (product ? product.price * item.quantity : 0);
      }, 0),
    [cart, products],
  );

  const checkout = useCallback(
    async (customer) => {
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerName: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            payment: customer.payment,
            total: cartTotal,
            items: cart,
          }),
        });
        const data = await response.json();
        if (!data.success) {
          showToast("Unable to place order");
          return false;
        }

        setCart([]);
        setLastOrder({ customer, items: cart, total: cartTotal });
        showToast("Order placed successfully");
        return true;
      } catch (error) {
        console.error(error);
        showToast("Server error");
        return false;
      }
    },
    [cart, cartTotal, setCart, showToast],
  );

  const value = useMemo(
    () => ({
      products,
      isLoading,
      cart,
      wishlist,
      currentUser,
      toast,
      lastOrder,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleWishlist,
      login,
      signup,
      logout,
      checkout,
      refreshProducts,
      showToast,
    }),
    [
      products,
      isLoading,
      cart,
      wishlist,
      currentUser,
      toast,
      lastOrder,
      cartTotal,
      addToCart,
      removeFromCart,
      updateQuantity,
      toggleWishlist,
      login,
      signup,
      logout,
      checkout,
      refreshProducts,
      showToast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
}
