const express = require("express");

const router = express.Router();

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_PUBLIC = process.env.PAYSTACK_PUBLIC_KEY || "";
const PAYSTACK_BASE = "https://api.paystack.co";

function isConfigured() {
  return Boolean(PAYSTACK_SECRET && PAYSTACK_PUBLIC);
}

router.get("/config", (req, res) => {
  res.json({
    configured: isConfigured(),
    publicKey: PAYSTACK_PUBLIC,
  });
});

router.post("/initialize", async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      message: "Paystack is not configured. Please set your Paystack keys.",
    });
  }

  const { email, amount } = req.body || {};
  const numericAmount = Number(amount);

  if (typeof email !== "string" || !email.trim() || !email.includes("@")) {
    return res.status(400).json({
      success: false,
      message: "A valid email is required for payment.",
    });
  }

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment amount.",
    });
  }

  try {
    const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        amount: Math.round(numericAmount * 100),
        currency: "NGN",
      }),
    });

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack init error:", data.message);
      return res.status(400).json({
        success: false,
        message: data.message || "Unable to initialize payment.",
      });
    }

    return res.json({
      success: true,
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Paystack initialize failed:", error);
    return res.status(500).json({
      success: false,
      message: "Payment initialization failed.",
    });
  }
});

router.post("/verify", async (req, res) => {
  if (!isConfigured()) {
    return res.status(503).json({
      success: false,
      message: "Paystack is not configured. Please set your Paystack keys.",
    });
  }

  const { reference } = req.body || {};

  if (typeof reference !== "string" || !reference.trim()) {
    return res.status(400).json({
      success: false,
      message: "Payment reference is required.",
    });
  }

  try {
    const response = await fetch(
      `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference.trim())}`,
      {
        headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
      },
    );

    const data = await response.json();

    if (data.status && data.data && data.data.status === "success") {
      return res.json({
        success: true,
        reference: data.data.reference,
        amount: data.data.amount,
      });
    }

    return res.status(400).json({
      success: false,
      message: data.message || "Payment was not successful.",
    });
  } catch (error) {
    console.error("Paystack verify failed:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed.",
    });
  }
});

module.exports = router;
