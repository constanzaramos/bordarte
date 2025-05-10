import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);

  if (checking) return <div>Cargando...</div>;

  // Si ya está logueado y está en login, redirige
  if (user && location.pathname === "/login") {
    return <Navigate to="/generador" replace />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
