import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2, FiTag } from "react-icons/fi";
import { useToast } from "../../context/ToastContext";
import { useModal } from "../../context/ModalContext";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useCart } from "../../context/CartContext";
import AuthModal from "../auth/AuthModal"; 
import { 
  fetchCart, 
  removeCartItem, 
  updateCartQuantity,
} from "../../api/cartService";

export default function Factor({ onTotalChange, goToTimeStep }) {
  const { addToast } = useToast();
  const { showConfirm } = useModal();
  const { refreshCart } = useCart();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // ← اضافه شده

  const loadCart = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchCart();
      if (result.success) {
        const items = result.data.cart || [];
        setCartItems(transformBackendCart(items));
      } else {
        if (result.unauthorized) {
          addToast("لطفاً ابتدا وارد حساب کاربری شوید", "error");
        } else {
          addToast(result.error || "خطا در بارگذاری سبد خرید", "error");
        }
      }
    } catch (err) {
      console.error("Cart load error:", err);
      addToast("خطای شبکه در دریافت سبد خرید", "error");
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const totalPrice = useMemo(() => {
    return cartItems?.reduce(
      (sum, item) => sum + (item.finalLineTotal || 0),
      0
    );
  }, [cartItems]);

  const originalTotalPrice = useMemo(() => {
    return cartItems?.reduce(
      (sum, item) => sum + (item.originalLineTotal || 0),
      0
    );
  }, [cartItems]);

  const hasAnyDiscount = originalTotalPrice > totalPrice;
  const savingsAmount = originalTotalPrice - totalPrice;

  useEffect(() => {
    if (onTotalChange) {
      onTotalChange({ 
        total: totalPrice, 
        originalTotal: originalTotalPrice 
      });
    }
  }, [totalPrice, originalTotalPrice, onTotalChange]);

  // ← تابع جدید برای چک لاگین
  const handleGoToTimeStep = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    
    if (!token) {
      addToast("برای ادامه فرایند خرید باید ورود/ثبت نام بکنید", "error");
      setIsAuthModalOpen(true);
      return;
    }
    
    if (goToTimeStep) {
      goToTimeStep();
    }
  };

  const handleIncreaseQty = async (item) => {
    const itemKey = item.id_unique;
    
    if (!itemKey) {
      addToast("خطا: شناسه آیتم نامعتبر است", "error");
      return;
    }
    
    const newQty = (item.qty || 1) + 1;
    
    setCartItems(prev => prev.map(i => 
      i.id_unique === itemKey ? { ...i, qty: newQty } : i
    ));
    
    try {
      const result = await updateCartQuantity(itemKey, newQty);
      if (!result.success) {
        if (result.unauthorized) {
          addToast("لطفاً ابتدا وارد حساب کاربری شوید", "error");
        } else {
          throw new Error(result.error || "خطا در به‌روزرسانی");
        }
      }
      
      if (result.data?.items) {
        setCartItems(transformBackendCart(result.data.items));
      }
      
      await refreshCart(); 
    } catch (error) {
      addToast(error.message || "خطا در افزایش تعداد", "error");
      loadCart();
    }
  };

  const handleDecreaseQty = async (item) => {
    if (item.qty <= 1) return;
    
    const itemKey = item.id_unique;
    
    if (!itemKey) {
      addToast("خطا: شناسه آیتم نامعتبر است", "error");
      return;
    }
    
    const newQty = item.qty - 1;
    
    setCartItems(prev => prev.map(i => 
      i.id_unique === itemKey ? { ...i, qty: newQty } : i
    ));
    
    try {
      const result = await updateCartQuantity(itemKey, newQty);
      if (!result.success) {
        if (result.unauthorized) {
          addToast("لطفاً ابتدا وارد حساب کاربری شوید", "error");
        } else {
          throw new Error(result.error || "خطا در به‌روزرسانی");
        }
      }
      
      if (result.data?.items) {
        setCartItems(transformBackendCart(result.data.items));
      }
      
      await refreshCart();
    } catch (error) {
      addToast(error.message || "خطا در کاهش تعداد", "error");
      loadCart();
    }
  };

  const handleRemove = (item) => {
    const name = item.name || "محصول";
    const itemKey = item.id_unique;
    
    if (!itemKey) {
      addToast("خطا: شناسه آیتم نامعتبر است", "error");
      return;
    }

    showConfirm({
      title: "حذف آیتم",
      message: `می‌خوای «${name}» رو از سبد حذف کنی؟`,
      confirmText: "بله، حذف کن",
      cancelText: "انصراف",
      variant: "danger",
      onConfirm: async () => {
        try {
          const result = await removeCartItem(itemKey);
          if (result.success) {
            setCartItems(prev => prev.filter(i => i.id_unique !== itemKey));
            addToast(`«${name}» حذف شد`, "success");
            if (result.data?.items) {
              setCartItems(transformBackendCart(result.data.items));
            }
            
            await refreshCart();
          } else {
            if (result.unauthorized) {
              addToast("لطفاً ابتدا وارد حساب کاربری شوید", "error");
            } else {
              throw new Error(result.error || "خطا در حذف");
            }
          }
        } catch (error) {
          addToast(error.message || "خطا در حذف آیتم", "error");
          loadCart();
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto mb-20 md:mb-0">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        dir="rtl"
        className="w-full max-w-5xl mx-auto mb-15 md:mb-0"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-2xl border bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-slate-200 dark:border-slate-700 flex flex-col max-h-[calc(100vh-6rem)] md:max-h-[calc(100vh-12rem)]">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-slate-800 dark:text-white shrink-0">
            فاکتور خرید
          </h2>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto min-h-0 pr-1 ">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="min-w-full text-sm rounded-xl overflow-hidden">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-slate-100 dark:bg-slate-800/70 text-slate-500 dark:text-slate-300">
                    <th className="py-3 px-4 text-right">محصول</th>
                    <th className="py-3 px-4 text-center">تعداد</th>
                    <th className="py-3 px-4 text-center">سایز</th>
                    <th className="py-3 px-4 text-center">خدمت</th>
                    <th className="py-3 px-4 text-center">جنس</th>
                    <th className="py-3 px-4 text-right">قیمت واحد</th>
                    <th className="py-3 px-4 text-right">قیمت کل</th>
                    <th className="py-3 px-4 text-center"></th>
                  </tr>
                </thead>

                <tbody>
                  <AnimatePresence>
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => {
                        const hasDiscount = item.hasDiscount;
                        const finalUnitPrice = item.unitPrice || 0;
                        const originalUnitPrice = item.originalUnitPrice || finalUnitPrice;
                        const finalLineTotal = item.finalLineTotal || 0;
                        const originalLineTotal = item.originalLineTotal || finalLineTotal;

                        return (
                          <motion.tr
                            key={item.id_unique}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.25 }}
                            className="border-b border-slate-200/60 dark:border-slate-700/50"
                          >
                            <td className="py-4 px-4 text-slate-900 dark:text-slate-200 font-semibold">
                              <div className="flex items-center gap-2">
                                {item.name}
                                {hasDiscount && (
                                  <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <FiTag size={10} />
                                    تخفیف
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-4 px-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleDecreaseQty(item)}
                                  disabled={item.qty <= 1}
                                  className={`
                                    w-8 h-8 flex items-center justify-center rounded-lg text-lg
                                    transition 
                                    ${item.qty <= 1
                                      ? "bg-slate-200 dark:bg-slate-700 cursor-not-allowed opacity-45"
                                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                                    }
                                  `}
                                >
                                  −
                                </button>

                                <span className="text-base font-bold text-slate-700 dark:text-slate-200 w-6 text-center">
                                  {item.qty}
                                </span>

                                <button
                                  onClick={() => handleIncreaseQty(item)}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg text-lg transition bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
                                >
                                  +
                                </button>
                              </div>
                            </td>

                            <td className="py-4 px-4 text-center text-slate-700 dark:text-slate-300">
                              {item.sizeDisplay || "-"}
                            </td>

                            <td className="py-4 px-4 text-center text-slate-700 dark:text-slate-300">
                              {item.service || "-"}
                            </td>

                            <td className="py-4 px-4 text-center text-slate-700 dark:text-slate-300">
                              {item.material || "-"}
                            </td>

                            <td className="py-4 px-4 text-right">
                              {hasDiscount ? (
                                <div className="flex flex-col gap-0.5">
                                  <span className="text-xs line-through text-slate-400 dark:text-slate-500 decoration-slate-400">
                                    {originalUnitPrice.toLocaleString()}
                                  </span>
                                  <span className="text-green-600 dark:text-green-400 font-bold">
                                    {finalUnitPrice.toLocaleString()}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                                  {finalUnitPrice.toLocaleString()}
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4 text-right">
                              {hasDiscount ? (
                                <div className="flex flex-col gap-0.5 items-end">
                                  <span className="text-xs line-through text-slate-400 dark:text-slate-500 decoration-slate-400 font-normal">
                                    {originalLineTotal.toLocaleString()}
                                  </span>
                                  <span className="text-green-600 dark:text-green-400 font-extrabold text-base">
                                    {finalLineTotal.toLocaleString()}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-slate-900 dark:text-white font-bold text-base">
                                  {finalLineTotal.toLocaleString()}
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => handleRemove(item)}
                                className="text-red-500 hover:text-red-600 transition"
                              >
                                <FiTrash2 size={20} />
                              </button>
                            </td>
                          </motion.tr>
                        );
                      })
                    ) : (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <td
                          colSpan={8}
                          className="py-10 text-center text-slate-400 dark:text-slate-300"
                        >
                          سبد خرید خالی است
                        </td>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3 pb-4">
              <AnimatePresence>
                {cartItems.map((item) => {
                  const hasDiscount = item.hasDiscount;
                  const finalUnitPrice = item.unitPrice || 0;
                  const originalUnitPrice = item.originalUnitPrice || finalUnitPrice;
                  const finalLineTotal = item.finalLineTotal || 0;
                  const originalLineTotal = item.originalLineTotal || finalLineTotal;

                  return (
                    <motion.div
                      key={item.id_unique}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      className="p-3 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-white text-sm">
                            {item.name}
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full mt-1 w-fit">
                              تخفیف دار
                            </span>
                          )}
                          {item.sizeDisplay && (
                            <span className="text-xs text-slate-500 mt-1">
                              سایز: {item.sizeDisplay}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col items-end">
                          {hasDiscount && (
                            <span className="text-xs line-through text-slate-400 dark:text-slate-500 mb-0.5">
                              {originalLineTotal.toLocaleString()} تومان
                            </span>
                          )}
                          <span className={`font-bold text-sm ${hasDiscount ? "text-green-600 dark:text-green-400" : "text-slate-900 dark:text-white"}`}>
                            {finalLineTotal.toLocaleString()} تومان
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed mb-3 space-y-1">
                        <div className="flex justify-between">
                          <span>خدمت:</span>
                          <span>{item.service || "-"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>جنس:</span>
                          <span>{item.material || "-"}</span>
                        </div>
                        
                        <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-800 mt-1">
                          <span>قیمت واحد:</span>
                          <div className="flex flex-col items-end">
                            {hasDiscount ? (
                              <>
                                <span className="line-through text-slate-400 text-[10px]">
                                  {originalUnitPrice.toLocaleString()}
                                </span>
                                <span className="text-green-600 dark:text-green-400 font-semibold">
                                  {finalUnitPrice.toLocaleString()}
                                </span>
                              </>
                            ) : (
                              <span>{finalUnitPrice.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecreaseQty(item)}
                            disabled={item.qty <= 1}
                            className={`
                              w-8 h-8 rounded-lg flex items-center justify-center text-base
                              ${item.qty <= 1
                                ? "bg-slate-300 dark:bg-slate-700 opacity-40"
                                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                              }
                            `}
                          >
                            −
                          </button>

                          <span className="text-slate-900 dark:text-white text-base font-bold w-6 text-center">
                            {item.qty}
                          </span>

                          <button
                            onClick={() => handleIncreaseQty(item)}
                            className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center text-base"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item)}
                          className="text-red-500 hover:text-red-600 p-2"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {cartItems.length === 0 && !loading && (
                <div className="text-center py-10 text-slate-400 dark:text-slate-300">
                  سبد خرید خالی است
                </div>
              )}
            </div>
          </div>

          {/* Fixed Bottom Section */}
          {cartItems.length > 0 && (
            <div className="border border-gray-300 dark:border-slate-700 pt-4 pb-4 mt-5 shrink-0 bg-white/90 dark:bg-slate-900/60 
                          shadow-lg rounded-2xl backdrop-blur-xl px-4 md:px-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                
                {/* سمت چپ در دسکتاپ (بخش سود) - در موبایل همون بالا می‌مونه */}
                <div className="md:order-2 flex items-center gap-2 flex-wrap justify-center md:justify-start">
                  {/* این لیبل فقط توی موبایل دیده می‌شه (همون چیزی که بود) */}
                  <span className="text-slate-500 dark:text-slate-400 text-xs md:hidden">
                    مبلغ قابل پرداخت:
                  </span>
                  
                  {hasAnyDiscount && (
                    <span className="inline-flex items-center gap-1 text-[11px] md:text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-800">
                      <span>💰 سود شما از خرید: {savingsAmount.toLocaleString()}</span>
                      <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-1 rounded text-[9px]">
                        %{Math.round((savingsAmount / originalTotalPrice) * 100)}
                      </span>
                    </span>
                  )}
                </div>

                {/* سمت راست در دسکتاپ (بخش قیمت) - در موبایل همون پایین می‌مونه */}
                <div className="md:order-1 flex items-center gap-2 flex-wrap justify-center md:justify-end">
                  {/* این لیبل فقط توی دسکتاپ اضافه می‌شه */}
                  <span className="hidden md:block text-slate-500 dark:text-slate-400 text-xs md:text-sm whitespace-nowrap">
                    مبلغ قابل پرداخت:
                  </span>
                  
                  {hasAnyDiscount && (
                    <span className="text-sm text-slate-400 dark:text-slate-500 line-through decoration-slate-400">
                      {originalTotalPrice.toLocaleString()}
                    </span>
                  )}
                  
                  <div className="flex items-baseline gap-1">
                    <span className={`text-xl md:text-2xl font-bold ${hasAnyDiscount ? "text-green-600 dark:text-green-400" : "text-slate-900 dark:text-white"}`}>
                      {totalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">تومان</span>
                  </div>
                </div>
              </div>

              {goToTimeStep && (
                <button
                  onClick={handleGoToTimeStep} // ← تغییر داده شد
                  disabled={cartItems.length === 0}
                  className="
                    w-full h-11 md:h-12 mt-4 rounded-xl
                    bg-sky-600 hover:bg-sky-700 active:scale-[0.98]
                    dark:bg-sky-700 dark:hover:bg-sky-600
                    text-white font-bold text-sm md:text-base
                    shadow-lg shadow-sky-600/30 
                    transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                  "
                >
                  انتخاب مکان
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>

      {/* مودال احراز هویت */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
}

// تابع تبدیل داده‌های بک‌اند
function transformBackendCart(backendItems) {
  if (!Array.isArray(backendItems)) return [];
  
  return backendItems.map((item) => {
    const unitPrice = parseInt(item.unit_price || item.price || 0);
    const originalPrice = parseInt(item.original_price || unitPrice);
    const quantity = parseInt(item.quantity || 1);
    
    const totalPrice = item.total_price || (unitPrice * quantity);
    const originalTotal = item.original_total || (originalPrice * quantity);
    
    return {
      id_unique: item.id_unique,
      name: item.product_name || "محصول",
      qty: quantity,
      unitPrice: unitPrice,           
      originalUnitPrice: originalPrice, 
      finalLineTotal: totalPrice,     
      originalLineTotal: originalTotal, 
      hasDiscount: originalPrice > unitPrice,
      sizeDisplay: item.size_display || (item.size ? `سایز ${item.size}` : "-"),
      service: item.service || "-",
      material: item.material || "-",
      productId: item.product_id
    };
  });
}
