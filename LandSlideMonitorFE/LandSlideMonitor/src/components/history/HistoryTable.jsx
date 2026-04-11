import HistoryTableRow from "./HistoryTableRow";

export default function HistoryTable({ records }) {
    return (
        <div className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-sm border border-outline-variant/10">
            <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low/50 border-b border-outline-variant/15">
                    <tr>
                        {[
                            "Timestamp",
                            "Device ID",
                            "Status",
                            "Moisture (%)",
                            "Acc (X, Y, Z)",
                            "Coordinates",
                        ].map((col) => (
                            <th
                                key={col}
                                className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant ${
                                    col === "Status"
                                        ? "text-center"
                                        : col === "Actions"
                                          ? "text-right"
                                          : ""
                                }`}
                            >
                                {col}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                    {records.length === 0 ? (
                        <tr>
                            <td
                                colSpan={6}
                                className="px-6 py-12 text-center text-on-surface-variant text-sm"
                            >
                                No records found.
                            </td>
                        </tr>
                    ) : (
                        records.map((record) => (
                            <HistoryTableRow key={record.id} record={record} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
