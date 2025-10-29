export const apiPost = async (url, data) => {
  try {
    console.log("🚀 Making request to:", url, data);
    const res = await fetch(`http://127.0.0.1:8000/api${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // 👈 برای ارسال کوکی
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    if (!res.ok) {
      console.error("❌ Error from:", url, res.status, resData);
      throw new Error(resData.message || "خطای سرور");
    }

    console.log("✅ Response from:", url, resData);
    return resData;
  } catch (err) {
    console.error("❌ Fetch error:", err);
    throw err;
  }
};
