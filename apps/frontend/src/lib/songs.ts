export type Song = {
  id: string;
  title: string;
  artist: string;
  vocalist: string;
  duration: string;
  tags: string[];
  reason: string;
  tone: 'purple' | 'blue' | 'pink';
};

// Sample catalog for the frontend preview. Media stays on the official YouTube service.
export const songs: Song[] = [
  {
    id: 'hxSg2Ioz3LM',
    title: 'ヒバナ (Hibana)',
    artist: 'DECO*27',
    vocalist: '하츠네 미쿠',
    duration: '3:23',
    tags: ['감정적인 보컬', '강한 전자음', '빠른 전개'],
    reason: '강한 전자음과 감정적인 보컬 표현을 선호한 취향과 잘 맞는 곡이에요.',
    tone: 'purple',
  },
  {
    id: 'P_CSdxSGfaA',
    title: 'アンノウン・マザーグース',
    artist: 'wowaka',
    vocalist: '하츠네 미쿠',
    duration: '4:45',
    tags: ['서사적인 가사', '다층적인 멜로디', '감정적인 보컬'],
    reason: '복잡한 감정과 서사, 독특한 멜로디 전개를 좋아한 피드백과 연결돼요.',
    tone: 'blue',
  },
  {
    id: 'i-DZukWFR64',
    title: 'テレキャスタービーボーイ',
    artist: 'すりぃ',
    vocalist: '카가미네 렌',
    duration: '2:44',
    tags: ['빠른 전개', '중독성', '밴드 사운드'],
    reason: '리듬감 있고 중독성 있는 전개를 좋아한다는 취향과 잘 맞아요.',
    tone: 'pink',
  },
  {
    id: '0HYm60Mjm0k',
    title: '命に嫌われている。',
    artist: 'カンザキイオリ',
    vocalist: '하츠네 미쿠',
    duration: '4:33',
    tags: ['어두운 분위기', '서사적인 가사', '감정적인 보컬'],
    reason: '무거운 주제 속에 진심을 담아낸 가사와 감정적인 표현을 만나 보세요.',
    tone: 'blue',
  },
  {
    id: '8oBV3jPTW4s',
    title: 'ロストワンの号哭',
    artist: 'Neru',
    vocalist: '카가미네 린',
    duration: '3:37',
    tags: ['강한 전자음', '서사적인 가사', '빠른 전개'],
    reason: '강렬한 밴드 사운드와 마음에 남는 가사가 취향의 새로운 면을 찾아줄 거예요.',
    tone: 'purple',
  },
  {
    id: 'KushW6zvazM',
    title: 'ゴーストルール',
    artist: 'DECO*27',
    vocalist: '하츠네 미쿠',
    duration: '3:26',
    tags: ['어두운 분위기', '강한 전자음', '감정적인 보컬'],
    reason: '선명한 전자음과 폭발적인 후렴이 강렬한 음악을 좋아하는 취향과 닮았어요.',
    tone: 'pink',
  },
];

export const tasteKeywords = [
  '강한 전자음',
  '감정적인 보컬',
  '빠른 전개',
  '서사적인 가사',
  '어두운 분위기',
];
