import { useState, useEffect } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Te hemos enviado un correo para restablecer tu contraseña ✉️");
      setError("");
    } catch (err) {
      console.error(err);
      setError("No se pudo enviar el correo. Verifica el email.");
      setMessage("");
    }
  };

  useEffect(() => {
    if (message) {
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [message, navigate]);

  return (
    <div className="min-h-screen bg-[#f9f4fb] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-gloock text-center text-[#252D76] mb-4">¿Olvidaste tu contraseña?</h2>
        <p className="text-sm text-center text-gray-500 mb-6">Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.</p>
        <form onSubmit={handleReset} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A771E7]"
          />
          <button
            type="submit"
            className="w-full bg-[#A771E7] text-white py-2 rounded-lg hover:bg-[#8b5fcf] transition"
          >
            Enviar enlace
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-[#252D76] text-sm hover:underline"
            onClick={() => navigate("/login")}
          >
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
