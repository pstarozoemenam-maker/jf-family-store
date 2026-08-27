import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Icon } from "./MobileIcons";

function MobileField({ label, children }) {
  return (
    <div className="m-field">
      <label>{label}</label>
      {children}
    </div>
  );
}

function PasswordInput(props) {
  const [show, setShow] = useState(false);
  return (
    <div className="m-password">
      <input type={show ? "text" : "password"} {...props} />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((s) => !s)}
      >
        <Icon name={show ? "eyeOff" : "eye"} size={20} />
      </button>
    </div>
  );
}

export function MobileLogin() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const success = await login(
      formData.get("email"),
      formData.get("password"),
    );
    setIsSubmitting(false);
    if (success) navigate("/m");
  }

  return (
    <section className="m-auth">
      <div className="m-auth-head">
        <h1>Welcome back</h1>
        <p>Login to continue shopping with JF &amp; Family.</p>
      </div>

      <form onSubmit={handleSubmit} className="m-form">
        <MobileField label="Email">
          <input type="email" name="email" placeholder="Enter your email" required />
        </MobileField>
        <MobileField label="Password">
          <PasswordInput name="password" placeholder="Enter your password" required />
        </MobileField>

        <button
          type="submit"
          className="m-btn m-btn-primary m-btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="m-auth-switch">
        Don't have an account? <Link to="/m/signup">Create account</Link>
      </p>
    </section>
  );
}

export function MobileSignup() {
  const { signup, showToast } = useStore();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (formData.get("password") !== formData.get("confirm")) {
      showToast("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    const success = await signup(
      formData.get("name").trim(),
      formData.get("email").trim(),
      formData.get("password"),
    );
    setIsSubmitting(false);
    if (success) navigate("/m/login");
  }

  return (
    <section className="m-auth">
      <div className="m-auth-head">
        <h1>Create account</h1>
        <p>Join JF &amp; Family and start shopping today.</p>
      </div>

      <form onSubmit={handleSubmit} className="m-form">
        <MobileField label="Name">
          <input type="text" name="name" placeholder="Enter your name" required />
        </MobileField>
        <MobileField label="Email">
          <input type="email" name="email" placeholder="Enter your email" required />
        </MobileField>
        <MobileField label="Password">
          <PasswordInput name="password" placeholder="Create a password" required />
        </MobileField>
        <MobileField label="Confirm Password">
          <PasswordInput name="confirm" placeholder="Confirm your password" required />
        </MobileField>

        <button
          type="submit"
          className="m-btn m-btn-primary m-btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <p className="m-auth-switch">
        Already have an account? <Link to="/m/login">Login</Link>
      </p>
    </section>
  );
}
