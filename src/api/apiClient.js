const API_BASE = import.meta.env.VITE_API_URL;

// ------------------------- Register OTP -------------------------
export async function sendRegisterOtp(phone) {
  try {
    const res = await fetch(`${API_BASE}/sent/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (err) {
    throw new Error(err?.message || "خطا در ارسال OTP");
  }
}

export async function verifyRegisterOtp(phone, otp) {
  try {
    const res = await fetch(`${API_BASE}register/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (err) {
    throw new Error(err?.message || "خطا در تایید OTP");
  }
}

// ------------------------- Finalize Register -------------------------
export async function finalizeRegister(phone, fullname, password) {
  try {
    const res = await fetch(`${API_BASE}register/otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, name: fullname, password }),
    });
    const data = await res.json();
    if (!res.ok) throw data;
    return data;
  } catch (err) {
    throw new Error(err?.message || "خطا در ثبت‌نام نهایی");
  }
}
