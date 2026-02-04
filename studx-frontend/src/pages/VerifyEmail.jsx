import React, { useState } from "react";
import axios from "axios";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-email", {
        otp,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Verify Email</h1>

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2 mb-3"
      />

      <button
        onClick={handleVerify}
        className="bg-black text-white px-4 py-2"
      >
        Verify
      </button>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default VerifyEmail;
