import { useState } from "react";
import { auth } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Login.scss";
import { getRedirectResult } from "firebase/auth";
import { useEffect } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/generador");
    } catch (err) {
      console.error(err);
      setError("Correo o contraseña inválidos.");
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (err) {
      console.error(err);
      setError("No se pudo iniciar sesión con Google.");
    }
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          navigate("/generador");
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Error al iniciar sesión con Google.");
      });
  }, []);

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>
          Bienvenida a <span>BordArte</span>
        </h2>
        <p className="subtitle">
          Inicia sesión para comenzar a crear tus patrones 💫
        </p>

        <form onSubmit={handleLogin}>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            className="input-field"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="input-field"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn-primary" type="submit">
            Iniciar sesión
          </button>
        </form>

        <div className="login-links">
          <button onClick={() => navigate("/forgot-password")}>¿Olvidaste tu contraseña?</button>
          <button onClick={() => navigate("/register")}>Crear cuenta</button>
        </div>

        <div className="divider">o</div>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
            alt="Google"
          />
          Iniciar sesión con Google
        </button>
      </div>
    </div>
  );
};

export default Login;
