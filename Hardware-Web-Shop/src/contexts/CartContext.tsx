import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CartItem, Product } from '../types';
import { toast } from 'sonner';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [user, authLoading] = useAuthState(auth);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [guestCart, setGuestCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('guest_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      setCartItems(guestCart);
      setIsLoading(false);
    }
  }, [guestCart, user]);

  // Firestore cart listener
  useEffect(() => {
    if (user) {
      setIsLoading(true);
      const cartRef = collection(db, `users/${user.uid}/cart`);
      const unsubscribe = onSnapshot(cartRef, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CartItem));
        setCartItems(items);
        setIsLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}/cart`);
        setIsLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Sync guest cart to Firestore when user logs in
  useEffect(() => {
    if (user && guestCart.length > 0) {
      const syncCart = async () => {
        for (const item of guestCart) {
          await addToCart(item.product_id, item.quantity);
        }
        setGuestCart([]);
        localStorage.removeItem('guest_cart');
      };
      syncCart();
    }
  }, [user]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    if (user) {
      try {
        const cartRef = collection(db, `users/${user.uid}/cart`);
        const q = query(cartRef, where('product_id', '==', productId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const itemDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, `users/${user.uid}/cart`, itemDoc.id), {
            quantity: itemDoc.data().quantity + quantity
          });
        } else {
          await addDoc(cartRef, { product_id: productId, quantity });
        }
        toast.success('Produkt zum Warenkorb hinzugefügt');
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/cart`);
        toast.error('Fehler beim Hinzufügen zum Warenkorb');
      }
    } else {
      setGuestCart(prev => {
        const existing = prev.find(item => item.product_id === productId);
        if (existing) {
          return prev.map(item => 
            item.product_id === productId 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          );
        }
        return [...prev, { id: Math.random().toString(36).substr(2, 9), product_id: productId, quantity }];
      });
      toast.success('Produkt zum Warenkorb hinzugefügt (Gast)');
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (user) {
      try {
        await deleteDoc(doc(db, `users/${user.uid}/cart`, itemId));
        toast.success('Produkt entfernt');
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/cart/${itemId}`);
      }
    } else {
      setGuestCart(prev => prev.filter(item => item.id !== itemId));
      toast.success('Produkt entfernt');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return removeFromCart(itemId);
    
    if (user) {
      try {
        await updateDoc(doc(db, `users/${user.uid}/cart`, itemId), { quantity });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/cart/${itemId}`);
      }
    } else {
      setGuestCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        const cartRef = collection(db, `users/${user.uid}/cart`);
        const snapshot = await getDocs(cartRef);
        for (const d of snapshot.docs) {
          await deleteDoc(doc(db, `users/${user.uid}/cart`, d.id));
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/cart`);
      }
    } else {
      setGuestCart([]);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, isLoading, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
