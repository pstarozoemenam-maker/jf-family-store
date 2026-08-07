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
    <section className="auth-section">
      <div className="auth-card">
        <h1>{title}</h1>
        <p>{description}</p>
        <form onSubmit={onSubmit}>
          {children}
          <button type="submit" className="btn btn-primary">
            {submitLabel}
          </button>
        </form>
        <p className="auth-link">{footer}</p>
      </div>
    </section>
  );
}

export function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const success = await onLogin(
      formData.get("email"),
      formData.get("password"),
    );
    setIsSubmitting(false);

    if (success) navigate("/");
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
      <FormField label="Email Address">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
        />
      </FormField>
      <FormField label="Password">
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          required
        />
      </FormField>
    </AuthLayout>
  );
}

export function SignupPage({ onSignup, onMessage }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (success) navigate("/login");
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
      <FormField label="Full Name">
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          required
        />
      </FormField>
      <FormField label="Email Address">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
        />
      </FormField>
      <FormField label="Password">
        <input
          type="password"
          name="password"
          placeholder="Create a password"
          required
        />
      </FormField>
      <FormField label="Confirm Password">
        <input
          type="password"
          name="confirm"
          placeholder="Confirm your password"
          required
        />
      </FormField>
    </AuthLayout>
  );
}
