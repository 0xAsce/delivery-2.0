"use client";

import { useSearchParams } from "next/navigation";
import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
function SellerLoginForm() {
 const searchParams = useSearchParams();
 const verified = searchParams.get("verified");
 const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[code,setCode]=useState(""),[challenge,setChallenge]=useState(""),[error,setError]=useState(""),[busy,setBusy]=useState(false),[verificationUrl,setVerificationUrl]=useState("");
 useEffect(()=>{setVerificationUrl(localStorage.getItem("sellerVerificationUrl")||"")},[]);
 async function login(e){e.preventDefault();setBusy(true);setError("");const r=await fetch("/api/seller/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});const d=await r.json();setBusy(false);if(!r.ok){setError(d.error||"Login failed.");return}if(d.requires2FA){setChallenge(d.challenge);return}window.location.href = "/seller/dashboard";}
 async function verify(e){e.preventDefault();setBusy(true);const r=await fetch("/api/seller/2fa/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({challenge,code})});const d=await r.json();setBusy(false);if(!r.ok){setError(d.error||"Invalid code.");return}window.location.href = "/seller/dashboard";}
 return <main className="min-h-screen bg-[#f7f8f4] p-4 flex items-center justify-center"><form onSubmit={challenge?verify:login} className="w-full max-w-md bg-white rounded-3xl p-6 shadow-sm border space-y-4"><h1 className="text-2xl font-black">{challenge?"Two-factor verification":"Seller login"}</h1>{verified && (
  <p>Email verified. You can now log in.</p>
)}
 {verificationUrl&&<div className="rounded-xl bg-blue-50 text-blue-700 p-3 text-sm"><b>Development verification link:</b><br/><a className="underline break-all" href={verificationUrl}>{verificationUrl}</a></div>}
 {error&&<div className="rounded-xl bg-red-50 text-red-700 p-3">{error}</div>}{challenge?<input autoFocus inputMode="numeric" maxLength={6} required value={code} onChange={e=>setCode(e.target.value)} placeholder="6-digit authenticator code" className="w-full rounded-xl border p-3"/>:<><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border p-3"/><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full rounded-xl border p-3"/></>}<button disabled={busy} className="w-full rounded-xl bg-black text-white p-3 font-bold">{busy?"Please wait…":challenge?"Verify":"Log in"}</button>{!challenge&&<><Link href="/seller/reset-password" className="block text-center text-sm underline">Forgot password?</Link><p className="text-sm text-center">New seller? <Link className="underline font-bold" href="/seller/register">Create account</Link></p></>}</form></main>
}
function SellerLogin() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          Loading...
        </main>
      }
    >
      <SellerLoginForm />
    </Suspense>
  );
}

export default SellerLogin;