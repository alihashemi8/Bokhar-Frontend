import React, { useState, useRef, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function CustomerDashboard({ onSave }) {
  const { user: contextUser, setUser, logout } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setLocalUser] = useState({ ...contextUser });
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  // هر وقت contextUser تغییر کرد، local state هم آپدیت شود
  useEffect(() => {
    setLocalUser({ ...contextUser });
  }, [contextUser]);

  // اعتبارسنجی
  function validate(values) {
    const e = {};
    if (!values.firstName.trim()) e.firstName = "نام لازم است.";
    if (!values.lastName.trim()) e.lastName = "نام خانوادگی لازم است.";
    if (!values.phone.trim()) e.phone = "شماره همراه لازم است.";
    else if (!/^09\d{9}$/.test(values.phone.trim()))
      e.phone = "فرمت شماره همراه صحیح نیست.";
    if (!values.email.trim()) e.email = "ایمیل لازم است.";
    else if (
      !/^[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email.trim())
    )
      e.email = "فرمت ایمیل صحیح نیست.";
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setLocalUser((prev) => ({ ...prev, [name]: value }));
  }

  function handlePickAvatar(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalUser((prev) => ({ ...prev, avatarUrl: url, _avatarFile: file }));
  }

  function triggerFile() {
    fileRef.current && fileRef.current.click();
  }

  async function handleSave(e) {
    e?.preventDefault();
    const v = validate(user);
    setErrors(v);
    if (Object.keys(v).length) return;

    try {
      setSaving(true);
      if (onSave) await onSave(user); // والد ممکن است فایل را آپلود کند
      setEditMode(false);
      setUser(user); // 🔹 آپدیت AuthContext بعد از ذخیره موفق
    } catch (err) {
      setErrors({ form: err?.message || "خطا در ذخیره‌سازی" });
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setLocalUser({ ...contextUser });
    setErrors({});
    setEditMode(false);
  }

  if (!contextUser) return <p>در حال بارگذاری اطلاعات کاربر...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">پروفایل شما</h2>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50 transition"
          >
            خروج از حساب
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center md:items-start md:col-span-1">
            <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-400">بدون تصویر</div>
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={triggerFile}
                className="px-3 py-2 rounded-md bg-white border hover:shadow-sm transition"
              >
                تغییر عکس
              </button>
              {user.avatarUrl && (
                <button
                  type="button"
                  onClick={() =>
                    setLocalUser((prev) => ({
                      ...prev,
                      avatarUrl: "",
                      _avatarFile: undefined,
                    }))
                  }
                  className="px-3 py-2 rounded-md bg-white border hover:shadow-sm transition"
                >
                  حذف
                </button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePickAvatar}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600">نام</label>
                <input
                  name="firstName"
                  value={user.firstName}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`mt-1 w-full rounded-md border px-3 py-2 bg-white ${
                    !editMode && "opacity-90 cursor-not-allowed"
                  }`}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  نام خانوادگی
                </label>
                <input
                  name="lastName"
                  value={user.lastName}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`mt-1 w-full rounded-md border px-3 py-2 bg-white ${
                    !editMode && "opacity-90 cursor-not-allowed"
                  }`}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600">
                  شماره همراه
                </label>
                <input
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`mt-1 w-full rounded-md border px-3 py-2 bg-white ${
                    !editMode && "opacity-90 cursor-not-allowed"
                  }`}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600">ایمیل</label>
                <input
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`mt-1 w-full rounded-md border px-3 py-2 bg-white ${
                    !editMode && "opacity-90 cursor-not-allowed"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm text-gray-600">آدرس</label>
                <input
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  disabled={!editMode}
                  className={`mt-1 w-full rounded-md border px-3 py-2 bg-white ${
                    !editMode && "opacity-90 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>

            {errors.form && (
              <p className="text-sm text-red-500 mt-3">{errors.form}</p>
            )}

            <div className="mt-6 flex items-center gap-3">
              {!editMode ? (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  ویرایش پروفایل
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:opacity-60"
                  >
                    {saving ? "در حال ذخیره..." : "ذخیره"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-white border rounded-md hover:shadow-sm transition"
                  >
                    انصراف
                  </button>
                </>
              )}

              <div className="ml-auto text-xs text-gray-500">
                شناسه کاربر: {contextUser.id || "—"}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
