export default function ProvinceFilter({
    provinces,
    selectedProvince,
    onProvinceChange,
}) {
    return (
        <div className="absolute top-2 right-16  z-[1000] bg-surface-container-low p-2 rounded-xl shadow-lg border border-outline-variant/20">
            <select
                value={selectedProvince}
                onChange={(e) => onProvinceChange(e.target.value)}
                className="w-full p-2.5 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary text-sm text-on-surface-variant"
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
