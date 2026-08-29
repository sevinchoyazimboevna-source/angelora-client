// @ts-nocheck
import { useState } from "react";
import { api } from "@/api/restClient";
import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AccountProfile() {
  const { toast } = useToast();
  const { user, checkUserAuth } = useAuth();
  const [form, setForm] = useState({
    memberNick: user?.memberNick || "",
    memberPhone: user?.memberPhone || "",
    memberAddres: user?.memberAddres || "",
    memberDesc: user?.memberDesc || "",
  });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.auth.updateProfile(form);
      await checkUserAuth();
      toast({ description: "Profile updated" });
    } catch (error) {
      toast({ description: error.message || "Could not update profile", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-medium tracking-tight">Personal information</h2>
      <p className="mt-2 text-sm text-muted-foreground">Manage your account details.</p>
      <form onSubmit={save} className="mt-8 max-w-lg space-y-5">
        <div className="space-y-1.5">
          <Label>Nickname</Label>
          <Input value={form.memberNick} onChange={(e) => setForm({ ...form, memberNick: e.target.value })} className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label>Phone</Label>
          <Input value={form.memberPhone} onChange={(e) => setForm({ ...form, memberPhone: e.target.value })} className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label>Address</Label>
          <Input value={form.memberAddres} onChange={(e) => setForm({ ...form, memberAddres: e.target.value })} className="h-11" />
        </div>
        <div className="space-y-1.5">
          <Label>About</Label>
          <Textarea value={form.memberDesc} onChange={(e) => setForm({ ...form, memberDesc: e.target.value })} rows={3} />
        </div>
        <Button type="submit" className="h-11 px-7" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
      </form>
    </div>
  );
}
