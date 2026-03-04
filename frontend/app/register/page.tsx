"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import { register } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterPage() {

const router = useRouter();
const { refreshUser } = useAuth();

const [form, setForm] = useState({
username: "",
email: "",
password: "",
confirmPassword: "",
});

const [showPassword, setShowPassword] = useState(false);
const [showConfirm, setShowConfirm] = useState(false);
const [loading, setLoading] = useState(false);

const passwordRules = {
length: form.password.length >= 8,
uppercase: /[A-Z]/.test(form.password),
lowercase: /[a-z]/.test(form.password),
number: /[0-9]/.test(form.password),
special: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
};

const isValidPassword =
passwordRules.length &&
passwordRules.uppercase &&
passwordRules.lowercase &&
passwordRules.number &&
passwordRules.special;

const passwordsMatch =
form.password &&
form.confirmPassword &&
form.password === form.confirmPassword;

async function handleSubmit(e: React.FormEvent) {
e.preventDefault();


if (!isValidPassword) {
  toast.error("Password does not meet requirements");
  return;
}

if (!passwordsMatch) {
  toast.error("Passwords do not match");
  return;
}

setLoading(true);

try {
  await register(form.username, form.email, form.password);

  await refreshUser();

  toast.success("Account created 🎉");

  router.push("/");
} catch (err: any) {
  toast.error(err.message || "Registration failed");
} finally {
  setLoading(false);
}


}

function Rule({ label, valid }: { label: string; valid: boolean }) {
return ( <div className="flex items-center gap-2 text-xs">
{valid ? ( <CheckCircle size={14} className="text-green-500" />
) : ( <XCircle size={14} className="text-red-400" />
)}
<span className={valid ? "text-green-600" : "text-neutral-500"}>
{label} </span> </div>
);
}

return (
   <div className="min-h-screen flex items-center justify-center px-6 bg-linear-to-br from-white via-neutral-50 to-neutral-100">


  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md bg-(--card) backdrop-blur-xl rounded-3xl p-8 card-shadow"
  >

    <h1 className="text-3xl font-bold mb-2 gradient-text">
      Create Account
    </h1>

    <p className="text-sm text-neutral-600 mb-8">
      Join SmartBite and unlock personalized recommendations.
    </p>

    <form onSubmit={handleSubmit} className="space-y-6">

      <input
        type="text"
        required
        placeholder="Username"
        value={form.username}
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
        className="w-full px-4 py-3 rounded-xl bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-(--primary)/40 transition text-sm"
      />

      <input
        type="email"
        required
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        className="w-full px-4 py-3 rounded-xl bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-(--primary)/40 transition text-sm"
      />

      <div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-(--primary)/40 transition text-sm pr-10"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="mt-4 space-y-2">
          <Rule label="At least 8 characters" valid={passwordRules.length} />
          <Rule label="One uppercase letter" valid={passwordRules.uppercase} />
          <Rule label="One lowercase letter" valid={passwordRules.lowercase} />
          <Rule label="One number" valid={passwordRules.number} />
          <Rule label="One special character" valid={passwordRules.special} />
        </div>
      </div>

      <div>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            required
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-(--primary)/40 transition text-sm pr-10"
          />

          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        {form.confirmPassword && (
          <p className={`text-xs mt-2 ${
            passwordsMatch ? "text-green-600" : "text-red-500"
          }`}>
            {passwordsMatch
              ? "Passwords match"
              : "Passwords do not match"}
          </p>
        )}
      </div>

      <button
        disabled={!isValidPassword || !passwordsMatch || loading}
        className="w-full py-3 rounded-xl bg-linear-to-r from-(--secondary) to-(--primary) text-white font-medium hover:scale-[1.02] transition disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Account"}
      </button>

    </form>

    <div className="mt-6 text-center text-sm text-neutral-600">
      Already have an account?{" "}
      <Link href="/login" className="text-(--primary) hover:underline">
        Login
      </Link>
    </div>

  </motion.div>
</div>


);
}
