import { Trophy, Users, Globe, LineChart } from 'lucide-react'

const features = [
  {
    icon: Trophy,
    title: '체계적인 프로그램',
    description: '취미반부터 선수반까지, 아이의 수준과 목표에 맞는 체계적인 커리큘럼으로 실력을 키워드립니다.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: LineChart,
    title: '개인 성장 관리',
    description: '분기별 성장 리포트와 개인 맞춤 훈련 로드맵으로 아이의 발전을 수치로 확인하세요.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Users,
    title: '전문 코칭 스태프',
    description: 'KFA 라이선스 보유 코치진이 각 아이에게 맞는 지도로 실력과 자신감을 키워드립니다.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Globe,
    title: '국내·해외 연계',
    description: '국내 리그 및 대회 참가부터 스페인 유소년 클럽 연계 프로그램까지 운영합니다.',
    color: 'bg-purple-50 text-purple-600',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            왜 풋볼아이인가요?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            단순한 축구 수업을 넘어, 아이의 성장을 함께하는 파트너가 되겠습니다
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow group"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
