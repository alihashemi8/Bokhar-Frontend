import React from 'react';


export default function KPICard({ title, value }) {
return (
<div className="bg-white p-4 rounded-lg shadow-sm flex flex-col">
<div className="text-xs text-slate-500">{title}</div>
<div className="mt-3 text-xl font-semibold text-slate-800">{value ?? '—'}</div>
</div>
);
}