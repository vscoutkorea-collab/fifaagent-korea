export const SITE = {
  name: '풋볼아이',
  fullName: '풋볼아이 축구교실',
  slogan: '시작은 놀이로, 완성은 교육으로',
  description: '보여주기식 훈련이 아닌, 성장에 집중한 체계적인 프로그램을 제공합니다',
  kakaoChannel: 'http://pf.kakao.com/_xiEYyd/chat',
  naverTalk: 'http://talk.naver.com/WC67WW',
  instagram: 'https://www.instagram.com/footballeye_official/',
  youtube: 'https://www.youtube.com/@%ED%92%8B%EB%B3%BC%EC%95%84%EC%9D%B4',
}

export const LOCATIONS = [
  {
    id: 'eungye',
    name: '은계점',
    address: '경기도 시흥시 은계번영길27, 시티파크 603,604,605호',
    phone: '031-312-9206',
    naverBookingUrl: 'https://naver.me/GahYCH6B',
    mapUrl: 'https://naver.me/xLNZDnhB',
    kakaoMapUrl: 'https://kko.to/bc0aXWqDXr',
    hours: '월~토 10:00 ~ 21:00',
  },
  {
    id: 'baegod',
    name: '배곧점',
    address: '경기도 시흥시 배곧4로 18 304호, 305호',
    phone: '031-312-9206',
    naverBookingUrl: 'https://naver.me/xAfi4XpN',
    mapUrl: 'https://naver.me/Fet9GiV2',
    kakaoMapUrl: 'https://kko.to/ynl7DbgQee',
    hours: '월~토 10:00 ~ 21:00',
  },
]

export const PROGRAMS = [
  {
    id: 'hobby',
    name: '취미반',
    target: '6~7세 유치부, 초등부, 중등부',
    description: '축구를 처음 접하는 아이들도 즐겁게 배울 수 있는 프로그램',
    features: ['기초 기술 습득', '팀워크·협동심 향상', '신체 발달 프로그램', '재미있는 게임식 훈련'],
    color: 'blue',
    icon: '⚽',
  },
  {
    id: 'elite',
    name: '엘리트반',
    target: '초등 3학년 ~ 중학교',
    description: '취미반보다 더 체계적인 훈련으로 실력을 높이고 싶은 아이들을 위한 프로그램',
    features: ['기본기와 기술을 완성하는 훈련', '반복 훈련을 통한 실전 적용 능력 향상', '다양한 대회 참가를 통한 경험과 자신감 형성', '코치의 지속적인 피드백을 통한 성장 관리'],
    color: 'green',
    icon: '🏆',
  },
  {
    id: 'pro',
    name: '선수반',
    target: '초등부 / 중등부',
    description: '프로를 목표로 하는 선수들을 위한 전문 엘리트 트레이닝',
    features: ['전문 선수 트레이닝', '국내외 대회 참가', '스페인 유소년 연계', '진학·진로 컨설팅'],
    color: 'orange',
    icon: '⭐',
  },
]

export const COACHES = [
  {
    id: 1,
    name: '김철수 감독',
    role: '대표 감독',
    career: ['前 프로축구단 선수', 'UEFA 라이선스 보유', '지도 경력 15년'],
    message: '축구는 단순한 스포츠가 아닙니다. 규칙을 지키고, 팀과 협력하는 법을 배우는 인생의 학교입니다.',
    image: '/coaches/coach1.jpg',
  },
  {
    id: 2,
    name: '이영희 코치',
    role: '취미반 담당',
    career: ['체육교육학과 졸업', 'KFA C급 라이선스', '지도 경력 8년'],
    message: '처음이어도 괜찮아요. 함께 즐기면서 자연스럽게 실력이 늘도록 도와드릴게요.',
    image: '/coaches/coach2.jpg',
  },
]

export const FAQS = [
  {
    q: '몇 살부터 등록할 수 있나요?',
    a: '만 5세(6세)부터 등록 가능합니다. 취미반은 초등 6학년까지, 중학생까지 참여할 수 있어요.',
  },
  {
    q: '축구를 전혀 못해도 괜찮나요?',
    a: '물론입니다! 취미반은 처음 시작하는 아이들을 위한 반이에요. 기초부터 차근차근 교육합니다.',
  },
  {
    q: '취미반과 엘리트반의 차이는 무엇인가요?',
    a: '취미반은 즐거운 놀이 중심, 엘리트반은 체계적인 기술 훈련과 대회 참가가 목적입니다. 상담 후 적합한 반을 추천해드립니다.',
  },
  {
    q: '수업은 어디서 진행되나요?',
    a: '은계점과 배곧점 두 곳에서 운영됩니다. 각 지점별 시설 정보는 지점 소개 페이지에서 확인하실 수 있어요.',
  },
  {
    q: '수업료는 얼마인가요?',
    a: '프로그램과 지점에 따라 다릅니다. 자세한 수업료는 카카오 채널이나 전화 상담을 통해 안내드립니다.',
  },
  {
    q: '무료 체험 수업이 있나요?',
    a: '네, 첫 방문 시 무료 체험 수업을 진행합니다. 전화 문의 또는 네이버 예약 또는 카카오 채널로 신청해 주세요.',
  },
  {
    q: '학기 중에도 등록할 수 있나요?',
    a: '언제든지 등록 가능합니다. 학기 중에도 자리가 있으면 바로 시작할 수 있어요.',
  },
  {
    q: '스페인 유소년 프로그램은 어떻게 참여하나요?',
    a: '선수반 등록 후 선발 과정을 거쳐 스페인 유소년 클럽 연계 프로그램에 참가할 수 있습니다.',
  },
]
