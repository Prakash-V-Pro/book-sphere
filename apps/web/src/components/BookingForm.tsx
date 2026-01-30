import type { TierRule } from "@shared/types";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface BookingFormProps {
  tiers: TierRule[];
  tickets: number;
  tier: string;
  onTierChange: (value: string) => void;
  onTicketsChange: (value: number) => void;
  eventSlug: string;
  selectedZoneId: string;
}

export function BookingForm({
  tiers,
  tickets,
  tier,
  onTierChange,
  onTicketsChange,
  eventSlug,
  selectedZoneId
}: BookingFormProps) {
  const activeTier = tiers.find((item) => item.key === tier);
  const maxTickets = activeTier?.maxTickets ?? 9;
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otpStep, setOtpStep] = useState<"idle" | "sent" | "verified">("idle");
  const [otp, setOtp] = useState("");

  const handleContinue = () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      window.alert("Please fill name, email, and mobile number.");
      return;
    }
    if (otpStep !== "verified") {
      window.alert("Please verify OTP before continuing.");
      return;
    }
    const params = new URLSearchParams({
      tickets: String(tickets),
      tier,
      zone: selectedZoneId,
      name,
      email,
      phone
    });
    router.push(`/checkout/${eventSlug}?${params.toString()}`);
  };

  return (
    <div className="glass rounded-3xl p-6">
      <div className="text-base font-semibold text-slate-900 dark:text-white">Booking details</div>
      <label className="mt-4 block text-sm text-slate-600 dark:text-slate-300" htmlFor="tierSelect">
        Customer tier
      </label>
      <select
        id="tierSelect"
        className="input-base mt-2"
        value={tier}
        onChange={(event) => onTierChange(event.target.value)}
      >
        {tiers.map((item) => (
          <option key={item.key} value={item.key}>
            {item.label} · up to {item.maxTickets} tickets
          </option>
        ))}
      </select>
      <div className="mt-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300" htmlFor="ticketCount">
          Tickets
        </label>
        <input
          id="ticketCount"
          className="input-base mt-2"
          type="number"
          min={1}
          max={maxTickets}
          value={tickets}
          onChange={(event) => onTicketsChange(Number(event.target.value))}
        />
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          Max allowed for this tier: {maxTickets}
        </div>
      </div>
      <div className="mt-5">
        <label className="block text-sm text-slate-600 dark:text-slate-300" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          className="input-base mt-2"
          placeholder="Full name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          className="input-base mt-2"
          placeholder="name@email.com"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="mt-4">
        <label className="block text-sm text-slate-600 dark:text-slate-300" htmlFor="phone">
          Mobile number
        </label>
        <input
          id="phone"
          className="input-base mt-2"
          placeholder="+1 555 0100"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>
      <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <div className="font-semibold text-slate-900 dark:text-white">OTP verification</div>
        {otpStep === "idle" && (
          <button
            className="btn-secondary mt-3"
            type="button"
            onClick={() => setOtpStep("sent")}
          >
            Send OTP
          </button>
        )}
        {otpStep === "sent" && (
          <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              className="input-base"
              placeholder="Enter OTP"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
            />
            <button
              className="btn-primary"
              type="button"
              onClick={() => setOtpStep(/^\d{4}$/.test(otp.trim()) ? "verified" : "sent")}
            >
              Verify
            </button>
          </div>
        )}
        {otpStep === "verified" && (
          <div className="mt-3 text-sm font-semibold text-brand-600">OTP verified ✅</div>
        )}
      </div>
      <button className="btn-primary mt-6 w-full" onClick={handleContinue} type="button">
        Continue to payment
      </button>
    </div>
  );
}

