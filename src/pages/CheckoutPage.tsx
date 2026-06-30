import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ChevronRight, Check, CreditCard, Truck, ShoppingBag,
  Lock, MapPin, User, Mail, Phone, ChevronDown,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useCartStore } from '@/stores';
import toast from 'react-hot-toast';

/* ─── Schemas ─────────────────────────────────────────────────────────────── */
const shippingSchema = z.object({
  firstName: z.string().min(2, 'Required'),
  lastName:  z.string().min(2, 'Required'),
  email:     z.string().email('Invalid email'),
  phone:     z.string().min(8, 'Invalid phone'),
  address:   z.string().min(5, 'Required'),
  city:      z.string().min(2, 'Required'),
  state:     z.string().min(2, 'Required'),
  zip:       z.string().min(3, 'Required'),
  country:   z.string().min(2, 'Required'),
});

const cardSchema = z.object({
  cardNumber: z.string().min(16, 'Enter valid card number').max(19),
  cardName:   z.string().min(2, 'Required'),
  expiry:     z.string().regex(/^\d{2}\/\d{2}$/, 'Format MM/YY'),
  cvv:        z.string().min(3, 'Required').max(4),
});

type ShippingData = z.infer<typeof shippingSchema>;
type CardData     = z.infer<typeof cardSchema>;

/* ─── Payment Methods ──────────────────────────────────────────────────────── */
const PAYMENT_METHODS = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    icons: [
      { name: 'Visa',       bg: '#1A1F71', text: '#fff',    content: 'VISA' },
      { name: 'Mastercard', bg: '#EB001B', text: '#fff',    content: 'MC'   },
      { name: 'Amex',       bg: '#007BC1', text: '#fff',    content: 'AMEX' },
    ],
  },
  {
    id: 'paypal',
    label: 'PayPal',
    icons: [{ name: 'PayPal', bg: '#003087', text: '#fff', content: 'PayPal' }],
  },
  {
    id: 'apple',
    label: 'Apple Pay',
    icons: [{ name: 'Apple Pay', bg: '#000', text: '#fff', content: '🍎 Pay' }],
  },
  {
    id: 'google',
    label: 'Google Pay',
    icons: [{ name: 'Google Pay', bg: '#fff', text: '#333', content: 'G Pay', border: true }],
  },
  {
    id: 'instapay',
    label: 'InstaPay',
    icons: [{ name: 'InstaPay', bg: '#7C3AED', text: '#fff', content: 'Insta' }],
  },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    icons: [{ name: 'COD', bg: '#16a34a', text: '#fff', content: '💵 COD' }],
  },
];

/* ─── Step Indicator ──────────────────────────────────────────────────────── */
const STEPS = [
  { id: 1, label: 'Shipping',  icon: MapPin      },
  { id: 2, label: 'Payment',   icon: CreditCard  },
  { id: 3, label: 'Review',    icon: ShoppingBag },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              animate={{
                background: current >= step.id ? '#1a6fff' : current === step.id - 1 ? 'rgba(26,111,255,0.15)' : 'transparent',
                borderColor: current >= step.id ? '#1a6fff' : 'rgba(100,116,139,0.4)',
              }}
              className="w-10 h-10 rounded-full border-2 flex items-center justify-center mb-1"
            >
              {current > step.id ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <step.icon className={`w-4 h-4 ${current >= step.id ? 'text-white' : 'text-gray-400'}`} />
              )}
            </motion.div>
            <span className={`text-xs font-medium ${current >= step.id ? 'text-blue-400' : 'text-gray-500'}`}>
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className="w-16 sm:w-24 h-px mx-2 mb-5 transition-colors duration-500"
              style={{ background: current > step.id ? '#1a6fff' : 'rgba(100,116,139,0.3)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Order Summary (sidebar) ─────────────────────────────────────────────── */
function OrderSummary({ total, tax, shipping = 0 }: { total: number; tax: number; shipping?: number }) {
  const { items } = useCartStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* mobile toggle */}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:hidden">
        <span className="font-semibold text-gray-900 dark:text-white text-sm">Order Summary</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-900 dark:text-white">${(total + tax + shipping).toFixed(2)}</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <div className={`sm:block ${open ? 'block' : 'hidden'}`}>
        <div className="p-5 sm:p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 hidden sm:block">Order Summary</h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.productId}-${item.color}-${item.size}`} className="flex gap-3">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center font-bold">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.product.name}</p>
                  <p className="text-xs text-gray-500">{item.color} / {item.size}</p>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white shrink-0">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span className="text-green-500 font-medium">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax (8%)</span>
            <span className="text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between">
            <span className="font-bold text-gray-900 dark:text-white">Total</span>
            <span className="font-bold text-gray-900 dark:text-white text-lg">${(total + tax + shipping).toFixed(2)}</span>
          </div>
        </div>

        <div className="px-5 pb-5 sm:px-6 sm:pb-6">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <Lock className="w-3.5 h-3.5" />
            Secured with 256-bit SSL encryption
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 1 : Shipping ────────────────────────────────────────────────────── */
function ShippingStep({ onNext }: { onNext: (data: ShippingData) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingData>({
    resolver: zodResolver(shippingSchema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="First Name" placeholder="John" error={errors.firstName?.message} 
        {...register('firstName')} />
        <Input label="Last Name"  placeholder="Doe"  error={errors.lastName?.message}  {...register('lastName')}  />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Mail className="absolute left-3 top-[42px] w-4 h-4 text-gray-400 pointer-events-none" />
          <Input label="Email" type="email" placeholder="john@example.com" className="pl-10"
            error={errors.email?.message} {...register('email')} />
        </div>
        <div className="relative">
          <Phone className="absolute left-3 top-[42px] w-4 h-4 text-gray-400 pointer-events-none" />
          <Input label="Phone" placeholder="+1 (555) 000-0000" className="pl-10"
            error={errors.phone?.message} {...register('phone')} />
        </div>
      </div>
      <Input label="Street Address" placeholder="123 Main St, Apt 4B"
        error={errors.address?.message} {...register('address')} />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Input label="City"     placeholder="New York" error={errors.city?.message}  {...register('city')}  />
        <Input label="State"    placeholder="NY"       error={errors.state?.message} {...register('state')} />
        <Input label="ZIP Code" placeholder="10001"    error={errors.zip?.message}   {...register('zip')} className="col-span-2 sm:col-span-1" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
        <select {...register('country')}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm">
          <option value="">Select country</option>
          {['United States','United Kingdom','Canada','Australia','Egypt','Saudi Arabia','UAE','Germany','France','Japan'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>}
      </div>

      {/* Shipping options */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Shipping Method</p>
        <div className="space-y-2">
          {[
            { id: 'free',     label: 'Standard Shipping',  sub: '5-7 business days', price: 'Free'  },
            { id: 'express',  label: 'Express Shipping',   sub: '2-3 business days', price: '$9.99' },
            { id: 'overnight',label: 'Overnight Shipping', sub: 'Next business day',  price: '$19.99'},
          ].map((opt, i) => (
            <label key={opt.id}
              className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-400 transition-colors has-[:checked]:border-blue-500 has-[:checked]:bg-blue-500/5">
              <div className="flex items-center gap-3">
                <input type="radio" name="shipping" value={opt.id} defaultChecked={i === 0} className="accent-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.sub}</p>
                </div>
              </div>
              <span className={`text-sm font-semibold ${opt.price === 'Free' ? 'text-green-500' : 'text-gray-900 dark:text-white'}`}>
                {opt.price}
              </span>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" variant="blue" className="w-full" rightIcon={<ChevronRight className="w-5 h-5" />}>
        Continue to Payment
      </Button>
    </form>
  );
}

/* ─── Step 2 : Payment ─────────────────────────────────────────────────────── */
function PaymentStep({ onNext, onBack }: { onNext: (data: { method: string; card?: CardData }) => void; onBack: () => void }) {
  const [method, setMethod] = useState('card');
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CardData>({
    resolver: cardSchema.optional() as any,
  });

  /* format card number with spaces */
  const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const submit = (cardData?: CardData) => onNext({ method, card: cardData });

  return (
    <div className="space-y-6">
      {/* Payment method selector */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Payment Method</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {PAYMENT_METHODS.map((pm) => (
            <button key={pm.id} type="button" onClick={() => setMethod(pm.id)}
              className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                method === pm.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}>
              <div className="flex gap-1">
                {pm.icons.map((ic) => (
                  <span key={ic.name}
                    className="px-2 py-0.5 rounded text-xs font-bold"
                    style={{
                      background: ic.bg,
                      color: ic.text,
                      border: (ic as any).border ? '1px solid #ddd' : undefined,
                    }}>
                    {ic.content}
                  </span>
                ))}
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center leading-tight">{pm.label}</span>
              {method === pm.id && <Check className="w-3.5 h-3.5 text-blue-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Card form */}
      <AnimatePresence mode="wait">
        {method === 'card' && (
          <motion.form key="card-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit((d) => submit(d))} className="space-y-4">

            {/* Visual card preview */}
            <div className="relative h-44 rounded-2xl overflow-hidden p-5 select-none"
              style={{ background: 'linear-gradient(135deg, #1a6fff 0%, #003087 50%, #0a0d14 100%)' }}>
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)' }} />
              <div className="absolute top-4 right-5 opacity-60">
                <div className="flex">
                  <div className="w-8 h-8 rounded-full bg-red-500 opacity-90" />
                  <div className="w-8 h-8 rounded-full bg-yellow-400 opacity-90 -ml-3" />
                </div>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white/50 text-xs mb-1 font-mono">Card Number</p>
                <p className="text-white font-mono text-lg tracking-widest">
                  {watch('cardNumber') || '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between mt-3">
                  <div>
                    <p className="text-white/50 text-xs">Card Holder</p>
                    <p className="text-white text-sm font-medium">{watch('cardName') || 'YOUR NAME'}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs">Expires</p>
                    <p className="text-white text-sm font-medium">{watch('expiry') || 'MM/YY'}</p>
                  </div>
                </div>
              </div>
            </div>

            <Input label="Card Number" placeholder="1234 5678 9012 3456" maxLength={19}
              error={errors.cardNumber?.message}
              {...register('cardNumber', {
                onChange: (e) => { e.target.value = formatCard(e.target.value); setValue('cardNumber', e.target.value); },
              })} />
            <Input label="Cardholder Name" placeholder="John Doe"
              error={errors.cardName?.message} {...register('cardName')} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry Date" placeholder="MM/YY" maxLength={5}
                error={errors.expiry?.message}
                {...register('expiry', {
                  onChange: (e) => { e.target.value = formatExpiry(e.target.value); setValue('expiry', e.target.value); },
                })} />
              <div className="relative">
                <Input label="CVV" placeholder="•••" maxLength={4} type="password"
                  error={errors.cvv?.message} {...register('cvv')} />
                <div className="absolute right-3 top-[42px] flex gap-px">
                  {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600" />)}
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
              <input type="checkbox" className="accent-blue-500 rounded" />
              Save card for future purchases
            </label>

            <div className="flex gap-3">
              <Button type="button" variant="outline" size="lg" onClick={onBack} className="flex-1">Back</Button>
              <Button type="submit" size="lg" variant="blue" className="flex-1" rightIcon={<ChevronRight className="w-5 h-5" />}>
                Review Order
              </Button>
            </div>
          </motion.form>
        )}

        {method === 'paypal' && (
          <motion.div key="paypal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4 text-center">
            <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ background: '#003087' }}>
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Pay with PayPal</p>
              <p className="text-sm text-gray-500">You'll be redirected to PayPal to complete your payment securely.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={onBack} className="flex-1">Back</Button>
              <Button size="lg" className="flex-1" onClick={() => submit()} style={{ background: '#003087', color: '#fff' }}
                rightIcon={<ChevronRight className="w-5 h-5" />}>
                Continue with PayPal
              </Button>
            </div>
          </motion.div>
        )}

        {(method === 'apple' || method === 'google') && (
          <motion.div key={method} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            <div className="p-8 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
              <p className="text-4xl mb-3">{method === 'apple' ? '🍎' : '🔵'}</p>
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                {method === 'apple' ? 'Apple Pay' : 'Google Pay'}
              </p>
              <p className="text-sm text-gray-500">Authenticate with your device to pay instantly.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={onBack} className="flex-1">Back</Button>
              <Button size="lg" variant="blue" className="flex-1" onClick={() => submit()}
                rightIcon={<ChevronRight className="w-5 h-5" />}>
                Pay Now
              </Button>
            </div>
          </motion.div>
        )}

        {method === 'instapay' && (
          <motion.div key="instapay" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">InstaPay Mobile Number</p>
              <Input placeholder="01xxxxxxxxx" type="tel" />
              <p className="text-xs text-gray-400">Enter the mobile number registered with InstaPay.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={onBack} className="flex-1">Back</Button>
              <Button size="lg" variant="blue" className="flex-1" onClick={() => submit()}
                rightIcon={<ChevronRight className="w-5 h-5" />}>
                Pay with InstaPay
              </Button>
            </div>
          </motion.div>
        )}

        {method === 'cod' && (
          <motion.div key="cod" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-4">
            <div className="p-6 rounded-2xl border-2 border-green-500/30 bg-green-500/5 text-center">
              <p className="text-3xl mb-3">💵</p>
              <p className="font-medium text-gray-900 dark:text-white mb-1">Cash on Delivery</p>
              <p className="text-sm text-gray-500">Pay when your order arrives at your door. No prepayment needed.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={onBack} className="flex-1">Back</Button>
              <Button size="lg" variant="blue" className="flex-1" onClick={() => submit()}
                rightIcon={<ChevronRight className="w-5 h-5" />}>
                Place Order (COD)
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Step 3 : Review ─────────────────────────────────────────────────────── */
function ReviewStep({
  shipping, payment, onBack, onPlace,
}: {
  shipping: ShippingData | null;
  payment: { method: string; card?: CardData } | null;
  onBack: () => void;
  onPlace: () => void;
}) {
  const { items, getTotalPrice } = useCartStore();
  const total = getTotalPrice();
  const tax   = total * 0.08;

  const methodLabel = PAYMENT_METHODS.find((m) => m.id === payment?.method)?.label ?? '';

  return (
    <div className="space-y-5">
      {/* Shipping summary */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
            <Truck className="w-4 h-4" /> Shipping Address
          </h3>
          <button onClick={onBack} className="text-xs text-blue-400 hover:underline">Edit</button>
        </div>
        {shipping && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {shipping.firstName} {shipping.lastName} · {shipping.address}, {shipping.city}, {shipping.state} {shipping.zip}, {shipping.country}
          </p>
        )}
      </div>

      {/* Payment summary */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Payment Method
          </h3>
          <button onClick={onBack} className="text-xs text-blue-400 hover:underline">Edit</button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {methodLabel}
          {payment?.card && ` ending in ${payment.card.cardNumber.replace(/\s/g, '').slice(-4)}`}
        </p>
      </div>

      {/* Items */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 space-y-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Items ({items.length})</h3>
        {items.map((item) => (
          <div key={`${item.productId}-${item.color}-${item.size}`} className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400 truncate mr-2">
              {item.product.name} × {item.quantity}
            </span>
            <span className="text-gray-900 dark:text-white font-medium shrink-0">
              ${(item.product.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between font-bold">
          <span className="text-gray-900 dark:text-white">Total</span>
          <span className="text-gray-900 dark:text-white">${(total + tax).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="flex-1">Back</Button>
        <Button size="lg" variant="blue" className="flex-1" onClick={onPlace}
          leftIcon={<Lock className="w-4 h-4" />}>
          Place Order
        </Button>
      </div>

      <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
        <Lock className="w-3 h-3" />
        Your payment is protected by 256-bit SSL encryption
      </p>
    </div>
  );
}

/* ─── Success ─────────────────────────────────────────────────────────────── */
function SuccessStep({ orderId }: { orderId: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="text-center py-10 px-4">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center">
        <Check className="w-10 h-10 text-white" strokeWidth={3} />
      </motion.div>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Placed! 🎉</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-2">Thank you for your order.</p>
      <p className="text-sm text-gray-400 mb-8">
        Order ID: <span className="font-mono font-medium text-blue-400">{orderId}</span>
      </p>
      <p className="text-sm text-gray-500 mb-8">A confirmation email has been sent to your inbox.</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/shop"><Button variant="outline" size="lg">Continue Shopping</Button></Link>
        <Link to="/profile"><Button size="lg" variant="blue">Track My Order</Button></Link>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ────────────────────────────────────────────────────────────── */
export default function CheckoutPage() {
  const navigate   = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [step,         setStep]         = useState(1);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [paymentData,  setPaymentData]  = useState<{ method: string; card?: CardData } | null>(null);
  const [orderId,      setOrderId]      = useState('');

  const total = getTotalPrice();
  const tax   = total * 0.08;

  if (items.length === 0 && step < 4) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="text-center px-4">
          <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h1>
          <Link to="/shop"><Button>Browse Products</Button></Link>
        </div>
      </div>
    );
  }

  const handleShipping = (data: ShippingData) => { setShippingData(data); setStep(2); window.scrollTo(0, 0); };
  const handlePayment  = (data: { method: string; card?: CardData }) => { setPaymentData(data); setStep(3); window.scrollTo(0, 0); };
  const handlePlace    = () => {
    const id = `NOV-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(id);
    clearCart();
    setStep(4);
    window.scrollTo(0, 0);
    toast.success('Order placed successfully!');
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        {step < 4 && (
          <div className="flex items-center gap-3 mb-8">
            <Link to="/cart" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
          </div>
        )}

        {step === 4 ? (
          <SuccessStep orderId={orderId} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
            {/* Main */}
            <div className="lg:col-span-2">
              <StepIndicator current={step} />

              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-400" /> Shipping Information
                      </h2>
                      <ShippingStep onNext={handleShipping} />
                    </motion.div>
                  )}
                  {step === 2 && (
                    <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-blue-400" /> Payment
                      </h2>
                      <PaymentStep onNext={handlePayment} onBack={() => setStep(1)} />
                    </motion.div>
                  )}
                  {step === 3 && (
                    <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-blue-400" /> Review Order
                      </h2>
                      <ReviewStep shipping={shippingData} payment={paymentData} onBack={() => setStep(2)} onPlace={handlePlace} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar */}
            <div className="order-first lg:order-last">
              <div className="lg:sticky lg:top-28">
                <OrderSummary total={total} tax={tax} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}