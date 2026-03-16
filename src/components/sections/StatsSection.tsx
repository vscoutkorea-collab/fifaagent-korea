const stats = [
  { value: '500+', label: '누적 수강생', sub: '믿고 맡긴 가정' },
  { value: '15년+', label: '지도 경력', sub: '검증된 노하우' },
  { value: '2개', label: '운영 지점', sub: '은계·배곧' },
  { value: '98%', label: '재등록률', sub: '높은 만족도' },
]

export default function StatsSection() {
  return (
    <section className="py-16 bg-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-green-100 font-semibold mb-0.5">{stat.label}</div>
              <div className="text-green-200 text-sm">{stat.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
