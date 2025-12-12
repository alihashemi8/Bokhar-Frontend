export default function OtpInput({ value, onChange }) {
  const arr = value.split("");

  return (
    <div dir="ltr" className="flex gap-2 justify-center mb-4">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          maxLength={1}
          value={arr[i] ?? ""}
          onChange={(e) => {
            const v = e.target.value;
            if (/^\d?$/.test(v)) {
              const newArr = [...arr];
              newArr[i] = v;
              onChange(newArr.join(""));
            }
          }}
          className="w-12 h-12 text-center border rounded-xl text-xl"
        />
      ))}
    </div>
  );
}
