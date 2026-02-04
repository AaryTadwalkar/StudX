import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login({ name: "Aary Tadwalkar" });
    navigate("/welcome");
  };

  return (
    <div>
      <h2>Login to StudX</h2>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
