interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
      {subtitle && <p className="mt-2 text-slate-500 leading-relaxed max-w-2xl">{subtitle}</p>}
    </div>
  );
}
