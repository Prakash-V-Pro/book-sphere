interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
}

export function SearchBar({ query, onChange }: SearchBarProps) {
  return (
    <div className="card hover-lift" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
      <input
        className="input"
        placeholder="Search events, concerts, movies, sports"
        value={query}
        onChange={(event) => onChange(event.target.value)}
      />
      <button className="btn btn-primary">Search</button>
    </div>
  );
}

