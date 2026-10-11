"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ChevronRight,
  Lock,
  CreditCard,
  Truck,
  ClipboardList,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

/* ─── Types ────────────────────────────────────────────── */
type Step = 1 | 2 | 3 | 4;

/* ─── Schemas ──────────────────────────────────────────── */
const shippingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName:  z.string().min(2, "Last name must be at least 2 characters"),
  email:     z.string().email("Please enter a valid email address"),
  phone:     z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\+\-\(\)]+$/, "Invalid phone number format"),
  address:   z.string().min(5, "Please enter your full address"),
  city:      z.string().min(2, "City required"),
  state:     z.string().min(2, "State required"),
  pincode:   z
    .string()
    .length(6, "Pincode must be exactly 6 digits")
    .regex(/^\d{6}$/, "Pincode must contain only digits"),
});
type ShippingForm = z.infer<typeof shippingSchema>;

const paymentSchema = z.object({
  cardNumber: z
    .string()
    .min(1, "Card number is required")
    .transform((v) => v.replace(/\s/g, ""))
    .refine((v) => /^\d{16}$/.test(v), "Card number must be 16 digits"),
  expiry: z
    .string()
    .min(1, "Expiry date is required")
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be MM/YY format")
    .refine((v) => {
      const [month, year] = v.split("/").map(Number);
      const now = new Date();
      const exp = new Date(2000 + year, month - 1);
      return exp > now;
    }, "Card has expired"),
  cvv: z
    .string()
    .min(1, "CVV is required")
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  nameOnCard: z
    .string()
    .min(3, "Name on card is required")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters"),
  paymentMethod: z.enum(["card", "upi"]),
  upiId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === "upi") {
    if (!data.upiId || data.upiId.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "UPI ID is required",
        path: ["upiId"],
      });
    } else if (!/^[\w.\-]+@[\w]+$/.test(data.upiId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid UPI ID format (e.g. name@upi)",
        path: ["upiId"],
      });
    }
  }
});
type PaymentForm = z.infer<typeof paymentSchema>;

/* ─── Constants ────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: "Shipping",  icon: Truck },
  { id: 2, label: "Delivery",  icon: Truck },
  { id: 3, label: "Payment",   icon: CreditCard },
  { id: 4, label: "Review",    icon: ClipboardList },
] as const;

const DELIVERY_OPTIONS = [
  { id: "standard",  label: "Standard Delivery",  days: "5–7 business days", price: 0,   description: "Free on orders above ₹999" },
  { id: "express",   label: "Express Delivery",    days: "2–3 business days", price: 199, description: "Get it faster"            },
  { id: "overnight", label: "Overnight Delivery",  days: "Next business day", price: 399, description: "Order before 3 PM"        },
] as const;

/* ─── Step indicator ──────────────────────────────────── */
function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center mb-10">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all border-2",
                current > step.id
                  ? "bg-sienna border-sienna text-white"
                  : current === step.id
                  ? "bg-charcoal border-charcoal text-white"
                  : "border-beige-300 text-charcoal-500 bg-beige-50"
              )}
            >
              {current > step.id ? <Check className="w-4 h-4" /> : step.id}
            </div>
            <span
              className={cn(
                "text-[10px] uppercase tracking-widest hidden sm:block",
                current >= step.id ? "text-charcoal" : "text-charcoal-500"
              )}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "h-px w-12 sm:w-20 mx-2 transition-colors",
                current > step.id + 1
                  ? "bg-sienna"
                  : current > step.id
                  ? "bg-charcoal"
                  : "bg-beige-300"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Error message ────────────────────────────────────── */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs text-red-600 mt-1.5 flex items-center gap-1"
    >
      <span className="inline-block w-1 h-1 rounded-full bg-red-600 flex-shrink-0" />
      {message}
    </motion.p>
  );
}

/* ─── Input classes ────────────────────────────────────── */
const inputBase =
  "w-full px-4 py-3 border bg-beige-50 focus:outline-none text-sm transition-colors";
const inputNormal = "border-beige-300 focus:border-charcoal";
const inputError  = "border-red-400 focus:border-red-500 bg-red-50/30";

/* ─── Helpers ──────────────────────────────────────────── */
function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + "/" + digits.slice(2);
  }
  return digits;
}

/* ─── Main page ────────────────────────────────────────── */
export default function CheckoutPage() {
  const [step, setStep]               = useState<Step>(1);
  const [shippingData, setShippingData] = useState<ShippingForm | null>(null);
  const [paymentData, setPaymentData]   = useState<PaymentForm | null>(null);
  const [delivery, setDelivery]         = useState("standard");
  const [orderPlaced, setOrderPlaced]   = useState(false);
  const [showCvv, setShowCvv]           = useState(false);
  const [payMethod, setPayMethod]       = useState<"card" | "upi">("card");

  const { items, total, clearCart } = useCartStore();
  const subtotal       = total();
  const deliveryOption = DELIVERY_OPTIONS.find((d) => d.id === delivery);
  const deliveryCharge = subtotal >= 999 && delivery === "standard" ? 0 : (deliveryOption?.price ?? 0);
  const orderTotal     = subtotal + deliveryCharge;

  /* Shipping form */
  const {
    register: regShip,
    handleSubmit: handleShip,
    formState: { errors: errShip },
  } = useForm<ShippingForm>({ resolver: zodResolver(shippingSchema) });

  /* Payment form */
  const {
    register: regPay,
    handleSubmit: handlePay,
    setValue: setPayVal,
    watch: watchPay,
    formState: { errors: errPay },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentMethod: "card" },
  });

  const onShippingSubmit = useCallback((data: ShippingForm) => {
    setShippingData(data);
    setStep(2);
  }, []);

  const onPaymentSubmit = useCallback((data: PaymentForm) => {
    setPaymentData(data);
    setStep(4);
  }, []);

  const handlePlaceOrder = async () => {
    setOrderPlaced(true);
    await new Promise((r) => setTimeout(r, 1500));
    clearCart();
    toast.success("Order placed successfully! 🎉");
  };

  /* ── Order success screen ── */
  if (orderPlaced) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
        >
          <Check className="w-10 h-10 text-green-600" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-display text-4xl font-bold text-charcoal mb-3">
            Order Confirmed!
          </h1>
          <p className="text-charcoal-500 mb-2">
            Thank you for shopping with FASHION.
          </p>
          <p className="text-xs text-charcoal-500 mb-8">
            Order ID: FS-{Date.now().toString().slice(-6)}
          </p>
          <Link href="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-8">
        <Link
          href="/cart"
          className="text-xs uppercase tracking-widest text-charcoal-500 hover:text-sienna flex items-center gap-1 mb-4"
        >
          ← Back to Cart
        </Link>
        <h1 className="font-display text-4xl font-bold text-charcoal">
          Checkout
        </h1>
      </div>

      <StepIndicator current={step} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
        {/* ── Left: Steps ── */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">

            {/* ── Step 1: Shipping ── */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-sans text-sm uppercase tracking-widest font-medium text-charcoal mb-6">
                  Shipping Address
                </h2>
                <form onSubmit={handleShip(onShippingSubmit)} className="space-y-4" noValidate>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                        First Name *
                      </label>
                      <input
                        {...regShip("firstName")}
                        className={cn(inputBase, errShip.firstName ? inputError : inputNormal)}
                        placeholder="Aarav"
                      />
                      <FieldError message={errShip.firstName?.message} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                        Last Name *
                      </label>
                      <input
                        {...regShip("lastName")}
                        className={cn(inputBase, errShip.lastName ? inputError : inputNormal)}
                        placeholder="Shah"
                      />
                      <FieldError message={errShip.lastName?.message} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                      Email *
                    </label>
                    <input
                      {...regShip("email")}
                      type="email"
                      className={cn(inputBase, errShip.email ? inputError : inputNormal)}
                      placeholder="you@example.com"
                    />
                    <FieldError message={errShip.email?.message} />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                      Phone *
                    </label>
                    <input
                      {...regShip("phone")}
                      type="tel"
                      className={cn(inputBase, errShip.phone ? inputError : inputNormal)}
                      placeholder="+91 98765 43210"
                    />
                    <FieldError message={errShip.phone?.message} />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                      Address *
                    </label>
                    <input
                      {...regShip("address")}
                      className={cn(inputBase, errShip.address ? inputError : inputNormal)}
                      placeholder="Street address, apartment, floor"
                    />
                    <FieldError message={errShip.address?.message} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                        Pincode *
                      </label>
                      <input
                        {...regShip("pincode")}
                        maxLength={6}
                        className={cn(inputBase, errShip.pincode ? inputError : inputNormal)}
                        placeholder="400001"
                      />
                      <FieldError message={errShip.pincode?.message} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                        City *
                      </label>
                      <input
                        {...regShip("city")}
                        className={cn(inputBase, errShip.city ? inputError : inputNormal)}
                        placeholder="Mumbai"
                      />
                      <FieldError message={errShip.city?.message} />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                        State *
                      </label>
                      <input
                        {...regShip("state")}
                        className={cn(inputBase, errShip.state ? inputError : inputNormal)}
                        placeholder="Maharashtra"
                      />
                      <FieldError message={errShip.state?.message} />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                    className="mt-2"
                  >
                    Continue to Delivery
                  </Button>
                </form>
              </motion.div>
            )}

            {/* ── Step 2: Delivery ── */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-sans text-sm uppercase tracking-widest font-medium text-charcoal mb-6">
                  Delivery Method
                </h2>
                <div className="space-y-3 mb-8">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <label
                      key={opt.id}
                      className={cn(
                        "flex items-center gap-4 p-4 border cursor-pointer transition-all",
                        delivery === opt.id
                          ? "border-charcoal bg-beige-100"
                          : "border-beige-300 hover:border-charcoal-500"
                      )}
                    >
                      <input
                        type="radio"
                        name="delivery"
                        value={opt.id}
                        checked={delivery === opt.id}
                        onChange={() => setDelivery(opt.id)}
                        className="accent-sienna"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-charcoal">
                            {opt.label}
                          </span>
                          <span className="text-sm font-medium text-charcoal">
                            {opt.price === 0
                              ? "FREE"
                              : formatPrice(opt.price)}
                          </span>
                        </div>
                        <p className="text-xs text-charcoal-500 mt-0.5">
                          {opt.days} · {opt.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Payment (fully validated) ── */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-sans text-sm uppercase tracking-widest font-medium text-charcoal mb-6">
                  Payment
                </h2>

                {/* Security badge */}
                <div className="flex items-center gap-2 mb-5 text-xs text-charcoal-500">
                  <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>SSL encrypted · Your payment info is never stored on our servers</span>
                </div>

                {/* Payment method toggle */}
                <div className="flex border border-beige-300 mb-6 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setPayMethod("card");
                      setPayVal("paymentMethod", "card");
                    }}
                    className={cn(
                      "flex-1 py-2.5 text-xs uppercase tracking-widest font-medium transition-colors",
                      payMethod === "card"
                        ? "bg-charcoal text-beige-50"
                        : "bg-beige-50 text-charcoal hover:bg-beige-100"
                    )}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPayMethod("upi");
                      setPayVal("paymentMethod", "upi");
                    }}
                    className={cn(
                      "flex-1 py-2.5 text-xs uppercase tracking-widest font-medium border-l border-beige-300 transition-colors",
                      payMethod === "upi"
                        ? "bg-charcoal text-beige-50"
                        : "bg-beige-50 text-charcoal hover:bg-beige-100"
                    )}
                  >
                    UPI
                  </button>
                </div>

                <form
                  onSubmit={handlePay(onPaymentSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  {/* Hidden field for payment method */}
                  <input type="hidden" {...regPay("paymentMethod")} />

                  <AnimatePresence mode="wait">
                    {payMethod === "card" ? (
                      <motion.div
                        key="card-fields"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        {/* Card number */}
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                            Card Number *
                          </label>
                          <div className="relative">
                            <input
                              {...regPay("cardNumber")}
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-number"
                              maxLength={19}
                              placeholder="4242 4242 4242 4242"
                              className={cn(
                                inputBase,
                                "font-mono tracking-wider pr-10",
                                errPay.cardNumber ? inputError : inputNormal
                              )}
                              onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value);
                                e.target.value = formatted;
                                setPayVal("cardNumber", formatted);
                              }}
                            />
                            <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-500" />
                          </div>
                          <FieldError message={errPay.cardNumber?.message} />
                        </div>

                        {/* Expiry + CVV */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                              Expiry (MM/YY) *
                            </label>
                            <input
                              {...regPay("expiry")}
                              type="text"
                              inputMode="numeric"
                              autoComplete="cc-exp"
                              maxLength={5}
                              placeholder="MM / YY"
                              className={cn(
                                inputBase,
                                errPay.expiry ? inputError : inputNormal
                              )}
                              onChange={(e) => {
                                const formatted = formatExpiry(e.target.value);
                                e.target.value = formatted;
                                setPayVal("expiry", formatted);
                              }}
                            />
                            <FieldError message={errPay.expiry?.message} />
                          </div>
                          <div>
                            <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                              CVV *
                            </label>
                            <div className="relative">
                              <input
                                {...regPay("cvv")}
                                type={showCvv ? "text" : "password"}
                                inputMode="numeric"
                                autoComplete="cc-csc"
                                maxLength={4}
                                placeholder="•••"
                                className={cn(
                                  inputBase,
                                  "pr-10",
                                  errPay.cvv ? inputError : inputNormal
                                )}
                              />
                              <button
                                type="button"
                                onClick={() => setShowCvv((v) => !v)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-500 hover:text-charcoal"
                                aria-label={showCvv ? "Hide CVV" : "Show CVV"}
                              >
                                {showCvv ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                            <FieldError message={errPay.cvv?.message} />
                          </div>
                        </div>

                        {/* Name on card */}
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                            Name on Card *
                          </label>
                          <input
                            {...regPay("nameOnCard")}
                            type="text"
                            autoComplete="cc-name"
                            placeholder="Aarav Shah"
                            className={cn(
                              inputBase,
                              errPay.nameOnCard ? inputError : inputNormal
                            )}
                          />
                          <FieldError message={errPay.nameOnCard?.message} />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="upi-fields"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">
                            UPI ID *
                          </label>
                          <input
                            {...regPay("upiId")}
                            type="text"
                            placeholder="yourname@paytm"
                            className={cn(
                              inputBase,
                              errPay.upiId ? inputError : inputNormal
                            )}
                          />
                          <FieldError message={errPay.upiId?.message} />
                          <p className="text-xs text-charcoal-500 mt-2">
                            Enter your UPI ID (e.g. name@okaxis, name@paytm)
                          </p>
                        </div>

                        {/* Supported UPI apps */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {["Google Pay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                            <span
                              key={app}
                              className="px-3 py-1 border border-beige-300 text-xs text-charcoal-500 rounded-sm"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-4 pt-2">
                    <Button variant="outline" type="button" onClick={() => setStep(2)}>
                      Back
                    </Button>
                    <Button
                      type="submit"
                      rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                      Review Order
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ── Step 4: Review ── */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="font-sans text-sm uppercase tracking-widest font-medium text-charcoal mb-6">
                  Review & Place Order
                </h2>

                {/* Shipping summary */}
                {shippingData && (
                  <div className="bg-beige-100 p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs uppercase tracking-widest text-charcoal-500">
                        Shipping To
                      </p>
                      <button
                        onClick={() => setStep(1)}
                        className="text-xs text-sienna hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="text-sm text-charcoal font-medium">
                      {shippingData.firstName} {shippingData.lastName}
                    </p>
                    <p className="text-xs text-charcoal-500">
                      {shippingData.address}, {shippingData.city} -{" "}
                      {shippingData.pincode}, {shippingData.state}
                    </p>
                    <p className="text-xs text-charcoal-500 mt-0.5">
                      {shippingData.phone} · {shippingData.email}
                    </p>
                  </div>
                )}

                {/* Payment summary */}
                {paymentData && (
                  <div className="bg-beige-100 p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs uppercase tracking-widest text-charcoal-500">
                        Payment
                      </p>
                      <button
                        onClick={() => setStep(3)}
                        className="text-xs text-sienna hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    {paymentData.paymentMethod === "card" ? (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-charcoal-500" />
                        <span className="text-sm text-charcoal">
                          •••• •••• •••• {paymentData.cardNumber.replace(/\s/g, "").slice(-4)}
                        </span>
                        <span className="text-xs text-charcoal-500">
                          · {paymentData.nameOnCard}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-charcoal">UPI — {paymentData.upiId}</p>
                    )}
                  </div>
                )}

                {/* Delivery summary */}
                <div className="bg-beige-100 p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs uppercase tracking-widest text-charcoal-500">
                      Delivery
                    </p>
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs text-sienna hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <p className="text-sm text-charcoal">
                    {deliveryOption?.label} —{" "}
                    {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                  </p>
                  <p className="text-xs text-charcoal-500">{deliveryOption?.days}</p>
                </div>

                {/* Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative w-12 h-16 bg-beige-200 flex-shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal truncate">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-charcoal-500">
                          {item.size} · {item.color.name} · Qty {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-charcoal flex-shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(3)}>
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    size="lg"
                    className="flex-1"
                  >
                    Place Order · {formatPrice(orderTotal)}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right: Order Summary (sticky) ── */}
        <div className="lg:col-span-1">
          <div className="bg-beige-100 p-5 sticky top-24">
            <h3 className="text-xs uppercase tracking-widest font-medium text-charcoal mb-5">
              Order Summary
            </h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-10 h-14 bg-beige-200 flex-shrink-0 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-charcoal text-white text-[9px] rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-charcoal font-medium truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[10px] text-charcoal-500">{item.size}</p>
                  </div>
                  <p className="text-xs font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-beige-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-charcoal-500">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-charcoal-500">
                <span>Shipping</span>
                <span>
                  {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
                </span>
              </div>
              <div className="flex justify-between font-medium text-charcoal border-t border-beige-200 pt-2 text-base">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>

            {/* Security note */}
            <div className="mt-5 pt-4 border-t border-beige-200 flex items-center gap-2">
              <Lock className="w-3 h-3 text-green-600 flex-shrink-0" />
              <p className="text-[10px] text-charcoal-500 leading-relaxed">
                256-bit SSL encryption. Your data is secure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
