const STATUS_STYLE = {
    0: {
        wrap: "flex gap-2",
        chip: "bg-surface-container px-1 rounded",
        text: "text-on-surface-variant",
    },
    1: {
        wrap: "flex gap-2 text-yellow-700 font-semibold",
        chip: "bg-yellow-300/50 px-1 rounded",
        text: "",
    },
    2: {
        wrap: "flex gap-2 text-tertiary font-bold",
        chip: "bg-tertiary-fixed px-1 rounded",
        text: "",
    },
};

export default function AccelerationCell({ data, status }) {
    const style = STATUS_STYLE[status] || STATUS_STYLE[0];

    const format = (v) => (typeof v === "number" ? v.toFixed(2) : "-");

    return (
        <div className={`font-mono text-[11px] ${style.text} ${style.wrap}`}>
            <span className={style.chip}>X: {format(data?.accelX)}g</span>
            <span className={style.chip}>Y: {format(data?.accelY)}g</span>
            <span className={style.chip}>Z: {format(data?.accelZ)}g</span>
        </div>
    );
}
