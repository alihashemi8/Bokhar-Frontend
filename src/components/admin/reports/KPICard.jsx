import React from 'react';


export default function KPICard({ title, value }) {
return (
<div className="bg-white dark:bg-gray-800  p-4 rounded-lg shadow-sm hover:dark:shadow-gray-400  flex flex-col">
<div className="text-xs text-slate-500 dark:text-white ">{title}</div>
<div className="mt-3 text-xl font-semibold text-slate-800 dark:text-white ">{value ?? '—'}</div>
</div>
);
}