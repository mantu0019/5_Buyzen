import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

/*
  Buyzen theme
  Cyprus     #004643
  Sand Dune  #F0EDE5

  Fonts: index.html ke <head> me ye add karo
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
*/

const brandFont = { fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif" };
const bodyFont = { fontFamily: "'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif" };

const inputBase =
  "w-full rounded-lg border bg-[#F0EDE5]/10 px-4 py-3 text-sm text-[#F0EDE5] placeholder-[#F0EDE5]/50 " +
  "outline-none transition focus:border-[#F0EDE5]/70 focus:bg-[#F0EDE5]/15 focus:ring-2 focus:ring-[#F0EDE5]/30";

const Field = ({ id, label, error, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[#F0EDE5]/90">
      {label}
    </label>
    <div className="relative">{children}</div>
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-[#ffb4a2]">
        {error.message}
      </p>
    )}
  </div>
);

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
    <path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.95.4-1.7 1.8-1.7h1.6V3.8c-.3 0-1.3-.2-2.5-.2-2.6 0-4.3 1.6-4.3 4.4v2.5H7.2v3.3H10V22h3.5z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socials = [
  { name: "Google", icon: <GoogleIcon /> },
  { name: "Facebook", icon: <FacebookIcon /> },
  { name: "X", icon: <XIcon /> },
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setSuccess(false);
    try {
      // TODO: apni API call yaha lagao, e.g. await axios.post("/api/register", data)
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("Register data:", data);
      setSuccess(true);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSocial = (provider) => {
    // TODO: OAuth flow yaha lagao
    console.log("Continue with", provider);
  };

  const borderFor = (name) =>
    errors[name] ? "border-[#ff9b85]" : "border-[#F0EDE5]/25";

  return (
    <main
      style={bodyFont}
      className="relative flex min-h-screen items-center justify-center bg-[#004643] bg-[url('/images/bg2.jpg')] bg-cover bg-center bg-no-repeat px-4 py-10 sm:px-6"
    >
      {/* Overlay: text readable rakhne ke liye. Image zyada dark lage to /55 ko kam kar do */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#00302e]/55" />

      <section className="relative w-full max-w-md rounded-2xl border border-[#F0EDE5]/20 bg-[#F0EDE5]/10 p-7 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
        <header className="text-center">
          <p className="text-4xl font-semibold tracking-wide text-[#F0EDE5] sm:text-5xl" style={brandFont}>
            Buyzen
          </p>
          <h1 className="mt-5 text-lg font-semibold text-[#F0EDE5]">Create your account</h1>
          <p className="mt-1 text-sm text-[#F0EDE5]/70">Sign up to start shopping.</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
          <Field id="fullName" label="Full name" error={errors.fullName}>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Mantu Kumar"
              aria-invalid={!!errors.fullName}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
              className={`${inputBase} ${borderFor("fullName")}`}
              {...register("fullName", {
                required: "Full name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" },
                maxLength: { value: 50, message: "Name can't be longer than 50 characters" },
                pattern: {
                  value: /^[A-Za-z][A-Za-z\s.'-]*$/,
                  message: "Use letters only (spaces, . ' - allowed)",
                },
                setValueAs: (v) => v.trim(),
              })}
            />
          </Field>

          <Field id="email" label="Email" error={errors.email}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={`${inputBase} ${borderFor("email")}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                  message: "Enter a valid email address",
                },
                setValueAs: (v) => v.trim(),
              })}
            />
          </Field>

          <Field id="password" label="Password" error={errors.password}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`${inputBase} ${borderFor("password")} pr-11`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
                validate: {
                  hasUpper: (v) => /[A-Z]/.test(v) || "Add at least one uppercase letter",
                  hasNumber: (v) => /\d/.test(v) || "Add at least one number",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#F0EDE5]/60 outline-none transition hover:text-[#F0EDE5] focus-visible:ring-2 focus-visible:ring-[#F0EDE5]/60"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </Field>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#F0EDE5] py-3 text-sm font-semibold text-[#004643] outline-none transition hover:bg-white focus-visible:ring-2 focus-visible:ring-[#F0EDE5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#004643] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          {success && (
            <p role="status" className="rounded-lg bg-[#F0EDE5]/15 px-3 py-2 text-center text-sm text-[#F0EDE5]">
              Account created. You can sign in now.
            </p>
          )}
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-[#F0EDE5]/60">
          <span className="h-px flex-1 bg-[#F0EDE5]/20" />
          or continue with
          <span className="h-px flex-1 bg-[#F0EDE5]/20" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {socials.map(({ name, icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => handleSocial(name)}
              aria-label={`Continue with ${name}`}
              className="flex h-11 items-center justify-center rounded-lg border border-[#F0EDE5]/25 bg-[#F0EDE5]/5 text-[#F0EDE5] outline-none transition hover:bg-[#F0EDE5]/15 focus-visible:ring-2 focus-visible:ring-[#F0EDE5]/60"
            >
              {icon}
            </button>
          ))}
        </div>

        <p className="mt-7 text-center text-sm text-[#F0EDE5]/70">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-[#F0EDE5] underline underline-offset-4 hover:text-white">
            Sign in
          </a>
        </p>
      </section>
    </main>
  );
};

export default Register;