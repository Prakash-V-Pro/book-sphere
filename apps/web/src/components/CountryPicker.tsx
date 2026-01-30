import type { GeoCountry } from "../lib/geo";

interface CountryPickerProps {
  country: GeoCountry;
  onChange: (next: GeoCountry) => void;
}

const options: GeoCountry[] = [
  { name: "United States", code: "US", currency: "USD" },
  { name: "India", code: "IN", currency: "INR" },
  { name: "United Kingdom", code: "GB", currency: "GBP" },
  { name: "Germany", code: "DE", currency: "EUR" }
];

export function CountryPicker({ country, onChange }: CountryPickerProps) {
  return (
    <div className="card hover-lift" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div>
        <div style={{ fontWeight: 600 }}>Location</div>
        <div className="muted">{country.city ?? "City"} · {country.name}</div>
      </div>
      <select
        className="input"
        style={{ maxWidth: "200px" }}
        value={country.code}
        onChange={(event) => {
          const next = options.find((opt) => opt.code === event.target.value);
          if (next) {
            onChange(next);
          }
        }}
      >
        {options.map((option) => (
          <option key={option.code} value={option.code}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}

