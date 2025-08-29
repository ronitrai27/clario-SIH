/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { MarqueeDemo } from "./_components/MarqueeLogin";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { LuChevronRight, LuInfo, LuLoader } from "react-icons/lu";
import { AnimatedGradientTextDemo } from "./_components/GerdaientText";
import Silk from "@/components/Silk/Silk";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import HCaptcha from "@hcaptcha/react-hcaptcha";

export default function AuthPage() {
  const captchaRef = useRef<HCaptcha>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  // signup - create account, signin - login
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const supabase = createClient();

  const handleLogin = async (provider: "google" | "discord" | "azure") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Login error:", error.message);
      toast.error(error.message);
    }
  };

  async function HandleAuth() {
    setLoading(true);
    setError("");
    try {
      if (isSignup) {
        // signup functionality
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            captchaToken: token || undefined,
          },
        });

        if (error) throw error;
        // for email verification
        if (data.user && !data.session) {
          setError("Please check your email for verification link");
          return;
        }
      } else {
        // login functionality
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
          options: {
            captchaToken: token || undefined,
          },
        });

        if (error) throw error;
        if (data.session) {
          router.push("/auth/callback");
        }
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <section>
      <main className="flex lg:flex-row gap-10">
        {/* LEFT SIDE */}
        <div className="flex-1">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="flex items-center mb-10">
              <Image
                src="/clario.png"
                alt="logo"
                width={80}
                height={80}
                className=""
              />
              <h1 className="font-raleway text-3xl font-bold">Clario</h1>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="font-inter text-sm tracking-wide bg-blue-50 text-black rounded border shadow-sm hover:bg-blue-100 hover:scale-105 hover:border-blue-400 cursor-pointer w-[280px] py-5"
                onClick={() => handleLogin("google")}
              >
                <Image
                  src="/search.png"
                  alt="Google"
                  width={25}
                  height={25}
                  className="mr-5"
                />{" "}
                continue with Google
              </Button>
              <Button
                className="font-inter text-sm tracking-wide bg-blue-50 text-black rounded border shadow-sm  hover:bg-blue-100 hover:scale-105 hover:border-blue-400 cursor-pointer  w-[280px] py-5"
                onClick={() => handleLogin("discord")}
              >
                <Image
                  src="/discord.png"
                  alt="Google"
                  width={25}
                  height={25}
                  className="mr-5"
                />{" "}
                continue with Discord
              </Button>
              <Button className="font-inter text-sm tracking-wide bg-blue-50 text-black rounded border shadow-sm  hover:bg-blue-100 hover:scale-105 hover:border-blue-400 cursor-pointer  w-[280px] py-5">
                <Image
                  src="/microsoft.png"
                  alt="Google"
                  width={25}
                  height={25}
                  className="mr-4"
                />{" "}
                continue with Microsoft
              </Button>
            </div>
            {/* ---- */}
            <p className="font-inter text-base font-light my-7">
              {" "}
              or continue with{" "}
              <span className="font-medium font-raleway  text-blue-500  ml-4">
                {isSignup ? "Creating Account" : "Logging In"}
              </span>
            </p>

            <div className="flex flex-col gap-5 w-full max-w-[320px] mx-auto">
              <div className="flex items-center justify-center gap-2 ">
                <Label className="font-inter">Email</Label>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded border "
                />
              </div>
              <div className="flex items-center justify-center gap-2 ">
                <Label className="font-inter">Pass</Label>
                <Input
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded border "
                />
              </div>
              {/* 👇 hCaptcha here */}
              <HCaptcha
                sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!}
                onVerify={(captchaToken) => setToken(captchaToken)}
                ref={captchaRef}
                // size="invisible"
                //  size="compact"
              />

              <Button
                className="rounded border font-raleway cursor-pointer"
                disabled={loading}
                onClick={HandleAuth}
              >
                {loading ? (
                  <>
                    <LuLoader className="animate-spin" />
                    {isSignup ? "Signing up..." : "Signing in..."}
                  </>
                ) : (
                  <>
                    {isSignup ? "Sign Up" : "Sign In"}
                    <LuChevronRight />
                  </>
                )}
              </Button>

              <p className="font-inter text-sm font-light">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <span
                  className="font-medium text-blue-500 text-sm font-raleway cursor-pointer"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </span>
              </p>
            </div>

            {error && (
              <p className="font-raleway text-sm text-muted-foreground text-center mt-10">
                <LuInfo className="mr-2 inline" /> {error}
              </p>
            )}
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="h-screen w-[50%] bg-black relative">
          {/* <Silk
            speed={5}
            scale={1}
            color="#005eff"
            noiseIntensity={1.5}
            rotation={0}
          /> */}
          {/* <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(70, 85, 110, 0.5) 0%, transparent 100%),
          radial-gradient(circle at 50% 100%, rgba(99, 102, 241, 0.4) 0%, transparent 100%),
          radial-gradient(circle at 50% 100%, rgba(181, 184, 208, 0.3) 0%, transparent 100%)
        `,
            }}
          /> */}

          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `
        radial-gradient(ellipse at 20% 30%, rgba(56, 189, 248, 0.4) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 70%),
        radial-gradient(ellipse at 60% 20%, rgba(236, 72, 153, 0.25) 0%, transparent 50%),
        radial-gradient(ellipse at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 65%)
      `,
            }}
          />
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2">
            <AnimatedGradientTextDemo />
          </div>
          <div className="absolute inset-0 ">
            <Image
              src="/clarioWhite.png"
              alt="Clario"
              width={80}
              height={80}
              className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full ">
            <h1 className="text-[42px] font-bold text-white font-sora tracking-wide text-center leading-snug">
              “Clarity Today, <br />{" "}
              <span className="bg-gradient-to-r from-blue-200 via-indigo-300 to-sky-100 bg-clip-text text-transparent ">
                Success Tomorrow.
              </span>
              ”
            </h1>
          </div>

          <div className="w-[99%] mx-auto absolute bottom-2">
            <MarqueeDemo />
          </div>
        </div>
      </main>
    </section>
  );
}
