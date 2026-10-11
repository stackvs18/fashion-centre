"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, MapPin, Heart, Settings,
  ChevronRight, Check, Pencil, Plus,
  type LucideIcon,
} from "lucide-react";
import { mockOrders } from "@/data/orders";
import { getFeaturedProducts } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/product/ProductCard";
import toast from "react-hot-toast";

type Tab = "profile" | "orders" | "addresses" | "wishlist" | "settings";

const TABS: { id: Tab; label: string; icon: LucideIcon }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

const STATUS_BADGE: Record<string, "new" | "sale" | "bestseller" | "lowstock" | "default"> = {
  Processing: "default",
  Shipped: "new",
  Delivered: "bestseller",
  Cancelled: "lowstock",
};

const MOCK_USER = {
  name: "Aarav Shah",
  email: "aarav@example.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&q=80",
  joined: "January 2024",
};

function ProfileTab() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(MOCK_USER.name);
  const [phone, setPhone] = useState(MOCK_USER.phone);

  return (
    <div className="max-w-md">
      <div className="flex items-center gap-5 mb-8 pb-8 border-b border-beige-200">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-beige-200">
          <Image src={MOCK_USER.avatar} alt={MOCK_USER.name} fill className="object-cover" sizes="80px" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-charcoal">{name}</h2>
          <p className="text-xs text-charcoal-500 uppercase tracking-widest mt-1">
            Member since {MOCK_USER.joined}
          </p>
        </div>
      </div>

      {editing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 border border-beige-300 bg-beige-50 focus:border-charcoal focus:outline-none text-sm" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">Email</label>
            <input value={MOCK_USER.email} readOnly className="w-full px-4 py-3 border border-beige-200 bg-beige-200 text-sm text-charcoal-500 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-charcoal-500 mb-1.5">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border border-beige-300 bg-beige-50 focus:border-charcoal focus:outline-none text-sm" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button onClick={() => { setEditing(false); toast.success("Profile updated!"); }}>
              <Check className="w-3.5 h-3.5 mr-1.5" /> Save Changes
            </Button>
            <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {[["Name", name], ["Email", MOCK_USER.email], ["Phone", phone]].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs uppercase tracking-widest text-charcoal-500 mb-1">{label}</p>
              <p className="text-sm text-charcoal">{value}</p>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setEditing(true)} leftIcon={<Pencil className="w-3.5 h-3.5" />}>
            Edit Profile
          </Button>
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="space-y-6">
      {mockOrders.map((order) => (
        <div key={order.id} className="border border-beige-200 overflow-hidden">
          {/* Order header */}
          <div className="flex items-center justify-between px-5 py-4 bg-beige-100">
            <div>
              <p className="font-sans text-sm font-medium text-charcoal">{order.id}</p>
              <p className="text-xs text-charcoal-500 mt-0.5">{new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={STATUS_BADGE[order.status]}>{order.status}</Badge>
              {order.trackingId && (
                <button className="text-xs uppercase tracking-widest text-sienna hover:underline">
                  Track
                </button>
              )}
            </div>
          </div>

          {/* Items */}
          <div className="px-5 py-4 space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="relative w-12 h-16 bg-beige-100 flex-shrink-0">
                  <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="48px" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-charcoal">{item.product.name}</p>
                  <p className="text-xs text-charcoal-500">{item.size} · {item.color.name} · Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-beige-200 flex justify-between items-center bg-beige-50">
            <p className="text-xs text-charcoal-500">
              {order.items.reduce((s, i) => s + i.quantity, 0)} items · {order.shipping === 0 ? "Free Shipping" : `Shipping ${formatPrice(order.shipping)}`}
            </p>
            <p className="text-sm font-display font-bold text-charcoal">{formatPrice(order.total)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AddressesTab() {
  const MOCK_ADDRESSES = [
    { id: "a1", label: "Home", name: "Aarav Shah", line1: "204, Sunrise Tower, Linking Road", city: "Mumbai", state: "Maharashtra", pincode: "400050", isDefault: true },
    { id: "a2", label: "Office", name: "Aarav Shah", line1: "WeWork, BKC", city: "Mumbai", state: "Maharashtra", pincode: "400051", isDefault: false },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {MOCK_ADDRESSES.map((addr) => (
          <div key={addr.id} className={cn("p-4 border relative", addr.isDefault ? "border-charcoal" : "border-beige-200")}>
            {addr.isDefault && (
              <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest bg-charcoal text-beige-50 px-2 py-0.5">Default</span>
            )}
            <p className="text-xs uppercase tracking-widest text-charcoal-500 mb-2">{addr.label}</p>
            <p className="text-sm font-medium text-charcoal">{addr.name}</p>
            <p className="text-xs text-charcoal-500 mt-1">{addr.line1}</p>
            <p className="text-xs text-charcoal-500">{addr.city}, {addr.state} - {addr.pincode}</p>
            <div className="flex gap-3 mt-3">
              <button className="text-xs uppercase tracking-widest text-sienna hover:underline">Edit</button>
              <button className="text-xs uppercase tracking-widest text-charcoal-500 hover:text-red-500">Remove</button>
            </div>
          </div>
        ))}
        <button className="border border-dashed border-beige-400 p-4 flex flex-col items-center justify-center gap-2 text-charcoal-500 hover:border-charcoal hover:text-charcoal transition-colors min-h-[120px]">
          <Plus className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest">Add Address</span>
        </button>
      </div>
    </div>
  );
}

function WishlistTab() {
  const wishlistProducts = getFeaturedProducts().slice(0, 4);
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div>
      {wishlistProducts.length === 0 ? (
        <div className="py-16 text-center">
          <Heart className="w-12 h-12 text-beige-300 mx-auto mb-4" />
          <p className="text-sm text-charcoal-500">No saved items yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {wishlistProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  const [notifications, setNotifications] = useState({ orders: true, promotions: false, newArrivals: true });

  return (
    <div className="max-w-md space-y-8">
      {/* Notifications */}
      <div>
        <h3 className="text-xs uppercase tracking-widest font-medium text-charcoal mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {Object.entries(notifications).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between py-3 border-b border-beige-200">
              <span className="text-sm text-charcoal capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
              <button
                onClick={() => setNotifications((n) => ({ ...n, [key]: !val }))}
                className={cn("w-10 h-5 rounded-full transition-colors relative", val ? "bg-sienna" : "bg-beige-300")}
              >
                <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", val ? "left-5" : "left-0.5")} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div>
        <h3 className="text-xs uppercase tracking-widest font-medium text-charcoal mb-4">Security</h3>
        <Button variant="outline" size="sm">Change Password</Button>
      </div>

      {/* Danger zone */}
      <div className="border border-red-200 p-4">
        <h3 className="text-xs uppercase tracking-widest font-medium text-red-600 mb-2">Danger Zone</h3>
        <p className="text-xs text-charcoal-500 mb-4">Permanently delete your account and all data.</p>
        <Button
          variant="outline"
          size="sm"
          className="!border-red-400 !text-red-600 hover:!bg-red-50"
          onClick={() => toast.error("Account deletion requires email confirmation.")}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const CONTENT: Record<Tab, React.ReactNode> = {
    profile: <ProfileTab />,
    orders: <OrdersTab />,
    addresses: <AddressesTab />,
    wishlist: <WishlistTab />,
    settings: <SettingsTab />,
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-charcoal">
          My Account
        </h1>
        <p className="text-charcoal-500 text-sm mt-2">Welcome back, {MOCK_USER.name.split(" ")[0]}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Sidebar tabs */}
        <aside className="md:w-56 flex-shrink-0">
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-medium whitespace-nowrap transition-all w-full text-left",
                    activeTab === tab.id
                      ? "bg-charcoal text-beige-50"
                      : "text-charcoal hover:bg-beige-200"
                  )}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {CONTENT[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
