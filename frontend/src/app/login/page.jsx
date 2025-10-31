"use client"

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import  { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { useState, useRef, useCallback, useEffect, useActionState } from "react";
import { signInWithPopup } from "firebase/auth";
import { googleAuth } from "@/lib/firebase-init";
import { auth } from "@/lib/firebase-init";
import { useAuth } from "@/context/authProvider";

const initialAuthState = { error: null, message: null };


function SubmitButton({ label, disabled }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="mt-6 inline-flex items-center justify-center rounded-[var(--radius)] border border-border bg-primary px-4 py-3 text-base font-semibold text-primary-foreground transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    >
      {pending ? "Working..." : label}
    </button>
  );
}

export default function Login(){
    const router= useRouter()
    
    const {authUser, loading, getIdToken } = useAuth()
    useEffect(()=>{
      if(authUser && !loading) {
        router.replace('/home')
      }

    },[authUser, loading, router])

    const searchParams = useSearchParams();
  
   const [mode, setMode] = useState('signin')
   const [oauthPending, setOauthPending] = useState(false);
   const [oauthError, setOauthError] = useState(null);
   const urlError = searchParams.get("error");

   const [signInState, signInAction] = useActionState(
    signInWithPasswordAction,
    initialAuthState,
  );
  const [signUpState, signUpAction] = useActionState(
    signUpWithPasswordAction,
    initialAuthState,
  );

   const fullNameContentRef = useRef(null);
  const [fullNameHeight, setFullNameHeight] = useState(0);

  const measureFullNameHeight = useCallback(() => {
    if (fullNameContentRef.current) {
      setFullNameHeight(fullNameContentRef.current.scrollHeight);
    }
  }, []);



  async function signInWithPasswordAction(prevState, formData){
  const email = formData.get("email");
  const password = formData.get("password");

   if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
   
   await signInWithEmailAndPassword(auth, email, password);
   
    return { message: "Sign in successful!" };
   
  } catch (error) {
    console.log(error)
    return { error: error.message }
  }
 
  
}

 async function signUpWithPasswordAction(prevState, formData){
  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("full_name");

  
  const endpoint='http://localhost:3000/add_name'
  
  try{
    await createUserWithEmailAndPassword(auth,email,password)
    
  }catch(error) {
    console.log(error)
    return { error: error.message}
  }
  const token = await getIdToken()
  if(token) {
    try {
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization' : `Bearer ${token}`,
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          name: fullName
        })
      }) 
  
    } catch (error) {
     console.log(error) 
    }

  } 
  
}



  async function handleGoogleSignIn() {
  setOauthError(null);
  setOauthPending(true);

  try {
    await signInWithPopup(auth, googleAuth)
  } catch (error) {
    console.log('error')
    setOauthError(error?.message ?? "Google sign-in failed");
    setOauthPending(false)
    router.push('/login')
    return
  } 
  setOauthPending(false)
  router.push('/home')
  

}

  useEffect(() => {
    measureFullNameHeight();
  }, [measureFullNameHeight]);

  useEffect(() => {
    window.addEventListener("resize", measureFullNameHeight);
    return () => {
      window.removeEventListener("resize", measureFullNameHeight);
    };
  }, [measureFullNameHeight]);

  useEffect(() => {
    if (mode === "signup") {
      requestAnimationFrame(measureFullNameHeight);
    }
  }, [mode, measureFullNameHeight]);

  const activeState = mode === "signup" ? signUpState : signInState;
  const formAction = mode === "signup" ? signUpAction : signInAction;

  const displayError = activeState?.error || oauthError || urlError;
  const displayMessage =
    mode === "signup" ? signUpState?.message : signInState?.message;


    return <>
      <Navbar/>
<div className="relative flex min-h-[80vh] flex-col font-sans text-foreground bg-background">
  {/* Ambient blobs (use tokens) */}
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div className="absolute -left-20 top-40 h-96 w-96 rounded-full bg-accent/10 blur-[120px]" />
    <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-primary/10 blur-[140px]" />
    <div className="absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
  </div>

  <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-14 sm:px-6 sm:py-16 lg:px-10">
    <section className="relative grid w-full max-w-4xl gap-10 overflow-hidden rounded-3xl border border-border bg-card/10 p-8 shadow-[0_45px_85px_-35px_rgba(15,23,42,0.65)] backdrop-blur-2xl sm:p-12 lg:grid-cols-[0.95fr_minmax(0,1.05fr)]">
      <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-foreground/10" aria-hidden="true" />

      {/* Left column */}
      <div className="relative z-10 flex flex-col justify-between gap-12">
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="w-fit rounded-full border border-border bg-card/40 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
          >
            Back to home
          </Link>

          <h2 className="text-3xl font-semibold leading-tight sm:text-4xl text-foreground">
            {mode === "signin" ? "Welcome back" : "Create your workspace"}
          </h2>

          <p className="max-w-sm text-base sm:text-lg text-muted-foreground">
            {mode === "signin"
              ? "Sign in to access your notes and transcripts."
              : "Set up your ClipNotes account and start creating together."}
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm text-muted-foreground/90">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground/70">
            Don't have time to watch the complete video?
          </p>
          <p>
            Create personalised cheatsheets to learn quicker!
          </p>
        </div>
      </div>

      {/* Right column (form) */}
      <div className="relative z-10 flex flex-col justify-center gap-8 rounded-2xl border border-border bg-card/40 p-6 shadow-lg sm:p-8">
        {/* Mode switch */}
        <div className="relative grid grid-cols-2 items-center overflow-hidden rounded-full border border-border bg-card/40 p-1 text-sm text-muted-foreground">
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-1 w-1/2 rounded-full bg-foreground/10 transition-transform duration-300 ease-out ${mode === "signin" ? "translate-x-0" : "translate-x-full"}`}
          />
          <button
            type="button"
            onClick={() => setMode("signin")}
            className="relative z-10 rounded-full px-4 py-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer text-foreground"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className="relative z-10 rounded-full px-4 py-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer text-foreground"
          >
            Sign Up
          </button>
        </div>

        {/* Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={oauthPending}
          className="flex items-center justify-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm font-medium text-foreground transition hover:bg-card/70 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:cursor-pointer"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-background text-sm font-semibold text-primary">
            G
          </span>
          {oauthPending ? "Redirecting to Google..." : "Sign in with Google"}
        </button>

        {/* Divider */}
        <div className="relative flex items-center gap-3 text-xs uppercase tracking-[0.4em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <span>or continue with email</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Form */}
        <form action={formAction} className="flex flex-col">
         

          {/* Full name (signup only) */}
          <div
            className="overflow-hidden transition-[max-height,opacity,margin] duration-500 ease-out"
            style={{
              maxHeight: mode === "signup" ? fullNameHeight : 0,
              opacity: mode === "signup" ? 1 : 0,
              marginBottom: mode === "signup" ? "1rem" : 0,
            }}
          >
            <div ref={fullNameContentRef}>
              <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                Full name
                <input
                  name="full_name"
                  type="text"
                  placeholder="Taylor Green"
                  className="rounded-xl border border-input bg-background/60 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
                  required={mode === "signup"}
                />
              </label>
            </div>
          </div>

          {/* Email */}
          <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
            Email
            <input
              name="email"
              type="email"
              placeholder="you@clipnotes.app"
              className="rounded-xl border border-input bg-background/60 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
          </label>

          {/* Password */}
          <label className="mt-4 flex flex-col gap-2 text-sm font-medium text-foreground">
            Password
            <input
              name="password"
              type="password"
              placeholder="********"
              className="rounded-xl border border-input bg-background/60 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
              minLength={6}
            />
          </label>

          {/* Submit */}
          <SubmitButton
            label={mode === "signin" ? "Sign In" : "Sign Up"}
            disabled={oauthPending}
          />
        </form>

        {/* Switch link */}
        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-semibold text-primary hover:text-primary/90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {mode === "signin" ? "Create one" : "Sign in"}
          </button>
        </p>

        {/* Messages */}
        <div className="min-h-[1.5rem] text-center text-sm" aria-live="polite">
          {displayError ? (
            <span className="text-destructive">{displayError}</span>
          ) : displayMessage ? (
            <span className="text-foreground/80">{displayMessage}</span>
          ) : null}
        </div>
      </div>
    </section>
  </div>
</div>

      <Footer/>
    </>
}