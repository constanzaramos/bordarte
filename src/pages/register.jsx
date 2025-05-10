import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("¡Cuenta creada exitosamente!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la cuenta.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f4fb] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-gloock text-center text-[#252D76] mb-4">Crear cuenta en BordArte</h2>
        <p className="text-sm text-center text-gray-500 mb-6">Regístrate para empezar a bordar ✨</p>
        <form onSubmit={handleRegister} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A771E7]"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A771E7]"
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A771E7]"
          />
          <button
            type="submit"
            className="w-full bg-[#A771E7] text-white py-2 rounded-lg hover:bg-[#8b5fcf] transition"
          >
            Registrarme
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-[#252D76] text-sm hover:underline"
            onClick={() => navigate("/login")}
          >
            ¿Ya tienes una cuenta? Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
