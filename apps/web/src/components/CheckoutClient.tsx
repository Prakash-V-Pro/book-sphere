"use client";

import { useMemo, useState } from "react";
import type { Event, GlobalConfig } from "@shared/types";
import { Stepper } from "./Stepper";
import { useRouter, useSearchParams } from "next/navigation";

interface CheckoutClientProps {
  event: Event;
  config: GlobalConfig;
}

export function CheckoutClient({ event, config }: CheckoutClientProps) {
  const [parking, setParking] = useState(false);
  const [discount, setDiscount] = useState("");
  const [paymentType, setPaymentType] = useState("Card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const tickets = Number(searchParams.get("tickets") ?? 1);
  const tier = searchParams.get("tier") ?? "normal";
  const zone = searchParams.get("zone") ?? "";
  const name = searchParams.get("name") ?? "Guest";
  const email = searchParams.get("email") ?? "";
  const phone = searchParams.get("phone") ?? "";

  const totalPrice = useMemo(() => {
    const base = Math.max(1, tickets) * Math.max(10, Math.round(event.basePrice * 0.7));
    const discountPct = discount ? 10 : 0;
    return Math.max(0, Math.round(base * (1 - discountPct / 100)));
  }, [tickets, event.basePrice, discount]);

  const handlePay = () => {
    if (paymentType === "Card" && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      window.alert("Please fill card details.");
      return;
    }
    if (paymentType === "UPI" && !upiId) {
      window.alert("Please enter UPI ID.");
      return;
    }
    if (paymentType === "NetBanking" && !bank) {
      window.alert("Please select a bank.");
      return;
    }
    if (paymentType === "Wallet" && !wallet) {
      window.alert("Please select a wallet.");
      return;
    }
    setIsPaying(true);
    setTimeout(() => {
      setPaymentDone(true);
      setTimeout(() => {
        const bookingId = crypto.randomUUID();
        const params = new URLSearchParams({
          bookingId,
          tickets: String(tickets),
          tier,
          zone,
          name,
          email,
          phone
        });
        router.push(`/success/${event.slug}?${params.toString()}`);
      }, 900);
    }, 1600);
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Checkout</h1>
        <div className="text-sm text-slate-500 dark:text-slate-300">{event.title}</div>
      </div>
      <Stepper steps={["Select seats", "Confirm details", "Pay", "Get tickets"]} activeIndex={2} />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-3xl p-6">
          <div className="mb-4 rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            <div className="font-semibold text-slate-900 dark:text-white">Booking summary</div>
            <div className="mt-2">Tickets: {tickets}</div>
            <div>Tier: {tier}</div>
            <div>Zone: {zone || "Auto"}</div>
            <div className="mt-2 font-semibold text-slate-900 dark:text-white">Total: {totalPrice} {event.currency}</div>
          </div>
          <div className="text-base font-semibold text-slate-900 dark:text-white">Payment options</div>
          <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            {config.paymentGateways.map((gateway) => (
              <label key={gateway} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentType === gateway}
                  onChange={() => setPaymentType(gateway)}
                />
                {gateway}
              </label>
            ))}
          </div>
          {paymentType === "Card" && (
            <div className="mt-4 grid gap-3">
              <input
                className="input-base"
                placeholder="Card number"
                value={cardNumber}
                onChange={(event) => setCardNumber(event.target.value)}
              />
              <input
                className="input-base"
                placeholder="Name on card"
                value={cardName}
                onChange={(event) => setCardName(event.target.value)}
              />
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="input-base"
                  placeholder="MM/YY"
                  value={cardExpiry}
                  onChange={(event) => setCardExpiry(event.target.value)}
                />
                <input
                  className="input-base"
                  placeholder="CVV"
                  value={cardCvv}
                  onChange={(event) => setCardCvv(event.target.value)}
                />
              </div>
            </div>
          )}
          {paymentType === "UPI" && (
            <div className="mt-4">
              <input
                className="input-base"
                placeholder="UPI ID (name@bank)"
                value={upiId}
                onChange={(event) => setUpiId(event.target.value)}
              />
            </div>
          )}
          {paymentType === "NetBanking" && (
            <div className="mt-4">
              <select className="input-base" value={bank} onChange={(event) => setBank(event.target.value)}>
                <option value="">Select bank</option>
                <option>HDFC</option>
                <option>ICICI</option>
                <option>SBI</option>
                <option>Axis</option>
              </select>
            </div>
          )}
          {paymentType === "Wallet" && (
            <div className="mt-4">
              <select className="input-base" value={wallet} onChange={(event) => setWallet(event.target.value)}>
                <option value="">Select wallet</option>
                <option>Paytm</option>
                <option>PhonePe</option>
                <option>Google Pay</option>
              </select>
            </div>
          )}
          {config.featureFlags.discounts && (
            <div className="mt-5">
              <label className="text-sm text-slate-600 dark:text-slate-300">Discount code</label>
              <input
                className="input-base mt-2"
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
                placeholder="PROMO10"
              />
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                {["LIVE10", "WEEKEND15", "FAN25"].map((code) => (
                  <button
                    key={code}
                    type="button"
                    className="rounded-full border border-slate-200 px-3 py-1 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-900"
                    onClick={() => setDiscount(code)}
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="glass rounded-3xl p-6">
          <div className="text-base font-semibold text-slate-900 dark:text-white">Customer details</div>
          <div className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            <div>{name}</div>
            <div>{email}</div>
            <div>{phone}</div>
          </div>
          <div className="mt-6 text-base font-semibold text-slate-900 dark:text-white">Add-ons</div>
          {event.parkingAvailable && config.featureFlags.parking && (
            <label className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input type="checkbox" checked={parking} onChange={() => setParking(!parking)} />
              Parking ticket
            </label>
          )}
          <button className="btn-primary mt-6 w-full" onClick={handlePay} type="button" disabled={isPaying}>
            {isPaying ? "Processing..." : "Pay and confirm"}
          </button>
          {isPaying && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="h-3 w-3 animate-pulse rounded-full bg-brand-400" />
              Processing payment...
            </div>
          )}
          {paymentDone && (
            <div className="mt-3 text-sm font-semibold text-brand-600">
              Payment complete ✓ Redirecting...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

