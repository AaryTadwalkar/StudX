export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center">Create Account</h2>

        <input className="w-full border p-2 rounded" placeholder="Full Name" />
        <input className="w-full border p-2 rounded" placeholder="Year (1-4)" />
        <input className="w-full border p-2 rounded" placeholder="Branch" />
        <input className="w-full border p-2 rounded" placeholder="PRN" />
        <input className="w-full border p-2 rounded" placeholder="College Email" />
        <input className="w-full border p-2 rounded" placeholder="Mobile Number" />
        <input type="password" className="w-full border p-2 rounded" placeholder="Password" />
        <input type="password" className="w-full border p-2 rounded" placeholder="Re-enter Password" />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}