import { useEffect, useState } from "react";
import { ArrowLeft, KeyRound, Phone, ShieldCheck } from "lucide-react";
import loginBackground from "../assets/login-bg.png";
import Button from "../components/shared/Button/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp } from "../services/authService";
import { useAuth } from "../context/AuthStateContext";
const cleanPhoneNumber = (value) => value.replace(/\D/g, "").slice(0, 11);

function getSafeRedirectPath(from) {
  const requestedPath =
    typeof from === "string"
      ? from
      : from?.pathname
        ? `${from.pathname}${from.search || ""}${from.hash || ""}`
        : "/profile";

  return requestedPath.startsWith("/") && !requestedPath.startsWith("//")
    ? requestedPath
    : "/profile";
}

function Login() {
  const [step, setStep] = useState("phone");
  const [mobile_no, setMobile_no] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  // for authentication and navigation
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // for resend otp
  const [countdown, setCountdown] = useState(60);
  const canResend = step === "otp" && countdown === 0;

  useEffect(() => {
    if (step !== "otp") return;

    if (countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, step]);

  const showOtpForm = async (event) => {
    event.preventDefault();

    if (!/^01[3-9]\d{8}$/.test(mobile_no)) {
      setError("Enter a valid 11-digit Bangladesh phone number.");
      return;
    }

    try {
      setError("");

      const response = await sendOtp(mobile_no);

      if (response.status) {
        setStep("otp");
        setCountdown(60);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
      console.error(error);
    }
  };

  const previewVerification = async (event) => {
    event.preventDefault();

    if (!/^\d{4}$/.test(otp)) {
      setError("Enter the 4-digit verification code.");
      return;
    }

    try {
      setError("");

      const response = await verifyOtp(mobile_no, otp);

      if (response.status) {
        login(response.user, response.token);
        navigate(getSafeRedirectPath(location.state?.from), { replace: true });
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError("OTP verification failed.");
      console.error(error);
    }
  };

  const changeNumber = () => {
    setStep("phone");
    setOtp("");
    setError("");
  };

  // Resend OTP logic

  const handleResendOtp = async () => {
    if (!canResend) return;

    try {
      const response = await sendOtp(mobile_no);

      if (response.status) {
        setOtp("");
        setError("");

        setCountdown(60);
      } else {
        setError(response.message);
      }
    } catch {
      setError("Failed to resend OTP.");
    }
  };

  return (
    <main
      className="relative isolate flex min-h-[calc(100svh-5rem)] items-center overflow-hidden bg-slate-950 px-3 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-12"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(6, 34, 19, 0.94) 0%, rgba(6, 34, 19, 0.78) 42%, rgba(6, 34, 19, 0.38) 100%), url(${loginBackground})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_25%,rgba(52,211,153,0.18),transparent_32%)]" />

      <div className="mx-auto grid w-full max-w-md min-w-0 items-center gap-8 lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-20">
        <section className="hidden max-w-xl text-white lg:block">
          <div className="mb-7 flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
            <ShieldCheck
              className="size-7 text-emerald-300"
              aria-hidden="true"
            />
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300">
            Simple. Fast. Secure.
          </p>
          <h1 className="mt-4 text-5xl font-bold leading-[1.12] tracking-tight">
            Your journey starts with one quick verification.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
            Enter your mobile number and we will send you a one-time code. No
            password to remember.
          </p>
        </section>

        <section className="w-full min-w-0 rounded-2xl border border-white/40 bg-white/95 p-5 shadow-[0_30px_90px_-28px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:rounded-3xl sm:p-10">
          <div className="mb-6 flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-[#18723a] sm:mb-8 sm:size-12 sm:rounded-2xl lg:hidden">
            <ShieldCheck className="size-6" aria-hidden="true" />
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#18723a]">
            {step === "phone" ? "Welcome to Gari Vara" : "Phone verification"}
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {step === "phone" ? "Login or sign up" : "Enter your OTP"}
          </h2>
          <p className="mt-3 leading-6 text-slate-500">
            {step === "phone"
              ? "Use your Bangladesh mobile number to continue."
              : `We sent a 4-digit code to +88 ${mobile_no}.`}
          </p>

          {step === "phone" ? (
            <form className="mt-6 sm:mt-8" onSubmit={showOtpForm} noValidate>
              <label className="block" htmlFor="mobile_no">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Mobile number
                </span>
                <span className="flex min-h-14 items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition focus-within:border-[#18723a] focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-700/10">
                  <span className="flex h-7 shrink-0 items-center gap-1.5 border-r border-slate-200 px-3 font-semibold text-slate-600 sm:gap-2 sm:px-4">
                    <Phone
                      className="size-4 text-[#18723a]"
                      aria-hidden="true"
                    />
                    +88
                  </span>
                  <input
                    className="min-w-0 flex-1 bg-transparent px-3 text-base font-semibold text-slate-950 outline-none sm:px-4 placeholder:font-normal placeholder:text-slate-400"
                    id="mobile_no"
                    name="mobile_no"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    placeholder="01XXXXXXXXX"
                    value={mobile_no}
                    onChange={(event) => {
                      setMobile_no(cleanPhoneNumber(event.target.value));
                      setError("");
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby="login-error"
                    autoFocus
                  />
                </span>
              </label>

              {error && <FormError message={error} />}

              <Button className="mt-6 min-h-12" type="submit" fullWidth>
                Send OTP
              </Button>
            </form>
          ) : (
            <form className="mt-6 sm:mt-8" onSubmit={previewVerification} noValidate>
              <label className="block" htmlFor="otp">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Verification code
                </span>
                <span className="flex min-h-14 items-center rounded-xl border border-slate-200 bg-slate-50 px-4 transition focus-within:border-[#18723a] focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-700/10">
                  <KeyRound
                    className="mr-3 size-5 text-[#18723a]"
                    aria-hidden="true"
                  />
                  <input
                    className="min-w-0 flex-1 bg-transparent text-center text-xl font-bold tracking-[0.35em] text-slate-950 outline-none placeholder:text-slate-300 sm:tracking-[0.5em]"
                    id="otp"
                    name="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="0000"
                    maxLength={4}
                    value={otp}
                    onChange={(event) => {
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 4));
                      setError("");
                    }}
                    aria-invalid={Boolean(error)}
                    aria-describedby="login-error"
                    autoFocus
                  />
                </span>
              </label>

              {error && <FormError message={error} />}

              <Button className="mt-6 min-h-12" type="submit" fullWidth>
                Verify OTP
              </Button>

              <div className="mt-5 flex flex-col items-center justify-between gap-3 text-sm sm:flex-row">
                <button
                  className="inline-flex items-center gap-1.5 font-semibold text-slate-500 transition hover:text-slate-900"
                  type="button"
                  onClick={changeNumber}
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Change number
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  className={`font-semibold transition ${
                    canResend
                      ? "text-[#18723a] hover:text-[#125d2e]"
                      : "cursor-not-allowed text-slate-400"
                  }`}
                >
                  {canResend ? "Resend OTP" : `Resend OTP in ${countdown}s`}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs leading-5 text-slate-400 sm:mt-8 sm:pt-6">
            By continuing, you agree to our <a href="/terms" className="text-emerald-600 hover:text-emerald-700">Terms of Service</a> and <a href="/privacy" className="text-emerald-600 hover:text-emerald-700">Privacy Policy</a>.
          </p>
        </section>
      </div>
    </main>
  );
}

function FormError({ message }) {
  return (
    <p
      className="mt-3 text-sm font-medium text-red-600"
      id="login-error"
      role="alert"
    >
      {message}
    </p>
  );
}

export default Login;
