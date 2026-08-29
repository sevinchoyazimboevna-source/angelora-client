import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/api/restClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Phone, Lock, User, Loader2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      await api.auth.register({ name, phone, password });
      window.location.href = safeReturnTo();
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <AuthLayout icon={UserPlus} title="Create your account" subtitle="Sign up to get started" footer={<>Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link></>}>
      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2"><Label htmlFor="name">Name</Label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="name" autoFocus placeholder="Your name" value={name} onChange={(e)=>setName(e.target.value)} className="pl-10 h-12" required /></div></div>
        <div className="space-y-2"><Label htmlFor="phone">Phone</Label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="phone" type="tel" autoComplete="tel" placeholder="010-1234-5678" value={phone} onChange={(e)=>setPhone(e.target.value)} className="pl-10 h-12" required /></div></div>
        <div className="space-y-2"><Label htmlFor="password">Password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="password" type="password" autoComplete="new-password" placeholder="••••••••" value={password} onChange={(e)=>setPassword(e.target.value)} className="pl-10 h-12" required /></div></div>
        <Button type="submit" className="w-full h-12 font-medium" disabled={loading}>{loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating account...</> : "Create account"}</Button>
      </form>
    </AuthLayout>
  );
}
