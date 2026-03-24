import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Categories } from './pages/Categories';
import { CategoryPage } from './pages/Category';
import { ProductPage } from './pages/Product';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Confirmation } from './pages/Confirmation';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Contact } from './pages/Contact';
import { About } from './pages/About';
import { Profile } from './pages/Profile';
import { seedData } from './services/seedService';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from 'sonner';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [user, loading] = useAuthState(auth);
  if (loading) return <div className="p-24 text-center text-2xl font-bold">Lade...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

export default function App() {
  React.useEffect(() => {
    // Seed the database with initial categories and products
    const hasReseeded = localStorage.getItem('has_reseeded_v2');
    if (!hasReseeded) {
      seedData(true).then(() => {
        localStorage.setItem('has_reseeded_v2', 'true');
      });
    } else {
      seedData();
    }
  }, []);

  return (
    <Router>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/kategorien" element={<Categories />} />
            <Route path="/kategorie/:id" element={<CategoryPage />} />
            <Route path="/produkt/:id" element={<ProductPage />} />
            <Route path="/warenkorb" element={<Cart />} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/bestaetigung" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/kontakt" element={<Contact />} />
            <Route path="/ueber-uns" element={<About />} />
            <Route path="/profil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
        <Toaster position="bottom-right" theme="dark" richColors />
      </CartProvider>
    </Router>
  );
}
