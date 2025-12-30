import React from 'react';


export default function KPICard({ title, value }) {
return (
<div className="bg-white/85 dark:bg-gray-800  p-4 rounded-lg hover:scale-[1.03] active:scale-[0.98] transition-all
border border-sky-200/50 shadow-lg hover:bg-white hover:dark:shadow-gray-400  flex flex-col">
<div className="text-xs text-slate-500 dark:text-white ">{title}</div>
<div className="mt-3 text-xl font-semibold text-slate-800 dark:text-white ">{value ?? '—'}</div>
</div>
);
}