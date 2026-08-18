"use client";
import { useState } from "react";
import Link from "next/link";

export default function SellerRegister() {
  const [form,setForm]=useState({name:"",storeName:"",email:"",phone:"",password:""});
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setBusy(true);setError("");
    const r=await fetch("/api/seller/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
    const d=await r.json(); setBusy(false);
    if(!r.ok){setError(d.error||"Registration failed.");return}
    if(d.verificationUrl) localStorage.setItem("sellerVerificationUrl", d.verificationUrl);
    window.location.href="/seller/login?registered=1";
  }
  const set=k=>e=>setForm(v=>({...v,[k]:e.target.value}));
  return <main className="min-h-screen bg-[#f7f8f4] p-4 flex items-center justify-center">
    <form onSubmit={submit} className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-4">
      <div><h1 className="text-2xl font-black">Create seller account</h1><p className="text-gray-500 mt-1">Set up your store and start managing orders.</p></div>
      {error&&<div className="rounded-xl bg-red-50 text-red-700 p-3">{error}</div>}
      {[["name","Your name"],["storeName","Store name"],["email","Email address"],["phone","Phone number"]].map(([k,p])=><input key={k} required type={k==="email"?"email":"text"} value={form[k]} onChange={set(k)} placeholder={p} className="w-full rounded-xl border p-3"/>)}
      <input required minLength={8} type="password" value={form.password} onChange={set("password")} placeholder="Password (8+ characters)" className="w-full rounded-xl border p-3"/>
      <button disabled={busy} className="w-full rounded-xl bg-black text-white p-3 font-bold">{busy?"Creating…":"Create seller account"}</button>
      <p className="text-sm text-center">Already registered? <Link className="underline font-bold" href="/seller/login">Log in</Link></p>
    </form>
  </main>
}
