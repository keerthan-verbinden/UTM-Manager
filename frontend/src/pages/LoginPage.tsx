import React, { useState } from "react";
import { Link2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext.tsx";

interface LoginPageProps {
  onSwitchToRegister: () => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSwitchToRegister,
  showToast,
}) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please provide both email and password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login(email, password);
      showToast("Logged in successfully", "success");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      showToast(err.message || "Login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-sm mb-3">
          <Link2 className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          UTM Manager
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in to your digital marketing agency workspace
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:rounded-xl sm:px-10 border border-slate-200 shadow-xs">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="marketer@agency.com"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-xs transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{isLoading ? "Signing in..." : "Sign in"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Don't have an account?</span>
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-semibold text-blue-600 hover:text-blue-700 transition"
            >
              Register here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
