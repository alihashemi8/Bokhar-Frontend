// frontend/src/api.js
export async function apiPost(endpoint, data) {
  try {
    const res = await fetch(`http://127.0.0.1:8000${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("خطا در درخواست");
    }

    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
async function verifyOtp(phone, otp, fullName, email) {
  return await apiPost("/verify-otp/", {
    phone: phone,
    otp: otp,
    full_name: fullName,
    email: email
  });
}