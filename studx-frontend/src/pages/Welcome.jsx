import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Welcome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to StudX, {user?.name} 🎉</h1>
      <button onClick={() => navigate("/home")}>
        Explore StudX
      </button>
    </div>
  );
}
