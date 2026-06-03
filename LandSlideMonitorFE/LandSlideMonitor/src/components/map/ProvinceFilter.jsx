export default function ProvinceFilter({
    provinces,
    selectedProvince,
    onProvinceChange,
}) {
    return (
        <div className="absolute right-3 top-3 z-[1000] rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-2 shadow-lg sm:right-16">
            <label htmlFor="map-province-filter" className="sr-only">
                Lọc tỉnh/thành phố
            </label>
            <select
                id="map-province-filter"
                value={selectedProvince}
                onChange={(e) => onProvinceChange(e.target.value)}
                className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-low px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/25"
            >
                <option value="all">Tất cả tỉnh thành</option>
                {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
