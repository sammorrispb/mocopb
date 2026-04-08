const stats = [
  { value: "2,000+", label: "Players" },
  { value: "30+", label: "Courts" },
  { value: "15+", label: "Groups" },
  { value: "8", label: "Facilities" },
];

export function StatBar() {
  return (
    <section className="py-10 px-4 bg-bg-alt">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="font-heading font-bold text-3xl md:text-4xl gradient-text-moco">
              {stat.value}
            </div>
            <div className="text-sm text-text-muted mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
