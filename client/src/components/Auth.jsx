import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "./FormField";

function AuthLayout({
  title,
  description,
  onSubmit,
  submitLabel,
  footer,
  children,
}) {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>{title}</h1>
        <p>{description}</p>

        <form onSubmit={onSubmit}>
          {children}

          <button type="submit">{submitLabel}</button>
        </form>

        <div className="auth-footer">{footer}</div>
      </div>
    </div>
  );
}

function EyeIcon({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 9.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z"
        fill="currentColor"
      />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M17.94 17.94C16.22 19.2 14.16 20 12 20c-5 0-9.27-3.11-11-7 1.16-2.61 3.01-4.74 5.28-6.12"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.9 9.9A3 3 0 0 0 14.1 14.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M14.1 9.9A3 3 0 0 1 9.9 14.1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const success = await onLogin(
      formData.get("email"),
      formData.get("password"),
    );

    setIsSubmitting(false);

    if (success) {
      navigate("/");
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      description="Login to continue shopping with JF & Family."
      onSubmit={handleSubmit}
      submitLabel={isSubmitting ? "Logging In..." : "Login"}
      footer={
        <>
          Don't have an account? <Link to="/signup">Create Account</Link>
        </>
      }
    >
      <FormField label="Email">
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
        />
      </FormField>

      <FormField label="Password">
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            placeholder="Enter your password"
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon visible={showPassword} />
          </button>
        </div>
      </FormField>
    </AuthLayout>
  );
}

export function SignupPage({ onSignup, onMessage }) {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (formData.get("password") !== formData.get("confirm")) {
      onMessage("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    const success = await onSignup(
      formData.get("name").trim(),
      formData.get("email").trim(),
      formData.get("password"),
    );

    setIsSubmitting(false);

    if (success) {
      navigate("/login");
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      description="Join JF & Family and start shopping today."
      onSubmit={handleSubmit}
      submitLabel={isSubmitting ? "Creating Account..." : "Create Account"}
      footer={
        <>
          Already have an account? <Link to="/login">Login</Link>
        </>
      }
    >
      <FormField label="Name">
        <input type="text" name="name" required placeholder="Enter your name" />
      </FormField>

      <FormField label="Email">
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
        />
      </FormField>

      <FormField label="Password">
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            required
            placeholder="Create a password"
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon visible={showPassword} />
          </button>
        </div>
      </FormField>

      <FormField label="Confirm Password">
        <div className="password-input">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirm"
            required
            placeholder="Confirm your password"
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon visible={showConfirmPassword} />
          </button>
        </div>
      </FormField>
    </AuthLayout>
  );
}
