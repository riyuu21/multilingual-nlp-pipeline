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
            <div className="select-trigger" onClick={() => setOpen(!open)}>
                {selected ? selected.label : placeholder}
                <span className="arrow">{open ? "▲" : "▼"}</span>
            </div>

            {open && (
                <div className="select-dropdown">
                    <input
                        autoFocus
                        placeholder="Search language..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
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