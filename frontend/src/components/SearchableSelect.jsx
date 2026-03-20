import { useState, useRef, useEffect } from "react";

function SearchableSelect({ value, onChange, options, placeholder }) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const filtered = options.filter(l =>
        l.label.toLowerCase().includes(search.toLowerCase())
    );

    const selected = options.find(l => l.value === value);

    useEffect(() => {
        function handleClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setSearch("");
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="searchable-select" ref={ref}>
            <button className="select-trigger" onClick={() => setOpen(!open)}>
                <span>{selected ? selected.label : placeholder}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6"/>
                </svg>
            </button>

            {open && (
                <div className="select-dropdown">
                    <div className="search-row">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                        </svg>
                        <input
                            autoFocus
                            placeholder="Search languages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <ul>
                        {filtered.map(l => (
                            <li
                                key={l.value}
                                className={l.value === value ? "active" : ""}
                                onClick={() => {
                                    onChange(l.value);
                                    setOpen(false);
                                    setSearch("");
                                }}
                            >
                                {l.label}
                            </li>
                        ))}
                        {filtered.length === 0 && <li className="no-results">No results</li>}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default SearchableSelect;