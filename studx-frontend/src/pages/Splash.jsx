import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const shown = sessionStorage.getItem("splashShown");

    if (shown) {
      navigate("/login");
    } else {
      sessionStorage.setItem("splashShown", "true");
      setTimeout(() => navigate("/login"), 2500);
    }
  }, []);

  return (
    <div className="center">
      🚀 StudX Splash Screen
    </div>
  );
}
