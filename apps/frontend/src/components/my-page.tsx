'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  AudioLines,
  Bell,
  Bookmark,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Heart,
  House,
  Link2,
  ListMusic,
  Menu,
  MessageSquareText,
  Music2,
  Play,
  Plus,
  Search,
  Share2,
  Sparkles,
  Star,
  UserRound,
  X,
} from 'lucide-react';
import { songs, type Song } from '@/lib/songs';

function MyPageLogo({ small = false }: { small?: boolean }) {
  return (
    <span className={`mypage-wave-logo ${small ? 'is-small' : ''}`} aria-hidden="true">
      {[16, 29, 40, 24].map((height, index) => (
        <i key={index} style={{ height }} />
      ))}
    </span>
  );
}

function TasteChart({ compact = false }: { compact?: boolean }) {
  const center = { x: 165, y: 130 };
  const values = [72, 65, 74, 55, 71, 73, 69];
  const point = (index: number, radius: number) => {
    const angle = ((-90 + (index * 360) / 7) * Math.PI) / 180;
    return `${center.x + Math.cos(angle) * radius},${center.y + Math.sin(angle) * radius}`;
  };

  return (
    <svg
      className={`mypage-taste-chart ${compact ? 'is-compact' : ''}`}
      viewBox="0 0 330 265"
      role="img"
      aria-label="취향 진단 결과: 보컬 72, 멜로디와 화성 65, 리듬과 속도 74, 편곡과 사운드 55, 가사와 주제 71, 분위기 73, 구성 69점"
    >
      {[1, 0.75, 0.5, 0.25].map((scale) => (
        <polygon
          key={scale}
          points={Array.from({ length: 7 }, (_, index) => point(index, 94 * scale)).join(' ')}
          className="mypage-chart-grid"
        />
      ))}
      {values.map((_, index) => (
        <line
          key={index}
          x1={center.x}
          y1={center.y}
          x2={point(index, 94).split(',')[0]}
          y2={point(index, 94).split(',')[1]}
          className="mypage-chart-axis"
        />
      ))}
      <polygon
        points={values.map((value, index) => point(index, value)).join(' ')}
        className="mypage-chart-value"
      />
      {values.map((value, index) => (
        <circle
          key={index}
          cx={point(index, value).split(',')[0]}
          cy={point(index, value).split(',')[1]}
          r="3.5"
          className="mypage-chart-dot"
        />
      ))}
      <g className="mypage-chart-labels">
        <text x="165" y="20" textAnchor="middle">
          보컬
        </text>
        <text x="246" y="54">
          멜로디·화성
        </text>
        <text x="264" y="151">
          리듬·속도
        </text>
        <text x="210" y="232">
          편곡·사운드
        </text>
        <text x="67" y="232">
          가사·주제
        </text>
        <text x="13" y="151">
          분위기
        </text>
        <text x="50" y="54">
          구성
        </text>
      </g>
    </svg>
  );
}

function SongThumb({ song, priority = false }: { song: Song; priority?: boolean }) {
  return (
    <span className={`mypage-song-thumb ${song.tone}`}>
      <Image
        width={120}
        height={90}
        src="/images/miku-sunset.webp"
        alt={`${song.title} 샘플 커버`}
        loading={priority ? 'eager' : 'lazy'}
      />
      <span>
        <Play size={13} fill="currentColor" />
      </span>
    </span>
  );
}

const sampleRatings = [
  { song: songs[4], when: '오늘', tags: ['서사적인 가사', '빠른 전개'], score: 5 },
  { song: songs[1], when: '어제', tags: ['감정적인 보컬', '다층적인 멜로디'], score: 4 },
  { song: songs[0], when: '3일 전', tags: ['강한 전자음', '중독성'], score: 5 },
];

const dummyMyPageData = {
  savedCount: 24,
  feedbackCount: 18,
  recentSongs: songs.slice(0, 3),
  playlists: ['밤 산책과 전자음', '감정적인 조교 모음', '새벽에 듣는 보카로'],
  accountCode: 'VPW-7A39-MK01',
  tasteKeywords: ['빠른 BPM', '강한 전자음', '감정적인 조교', '서사적 후렴'],
  favoriteProducers: ['DECO*27', 'ピノキオピー', 'Orangestar'],
  favoriteSong: songs[0],
};

export function MyPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState('');
  const {
    savedCount,
    feedbackCount,
    recentSongs,
    playlists,
    accountCode,
    tasteKeywords,
    favoriteProducers,
    favoriteSong,
  } = dummyMyPageData;

  useEffect(() => {
    if (!profileOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setProfileOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [profileOpen]);

  const copyProfile = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/mypage?profile=miku-fan`);
      setToast('프로필 링크를 복사했어요.');
    } catch {
      setToast('브라우저에서 클립보드 권한을 허용해 주세요.');
    }
    window.setTimeout(() => setToast(''), 2400);
  };

  return (
    <div className="mypage-shell">
      {mobileMenu && (
        <button
          className="mypage-mobile-backdrop"
          aria-label="메뉴 닫기"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <aside className={`mypage-sidebar ${mobileMenu ? 'is-open' : ''}`}>
        <div className="mypage-sidebar-head">
          <Link className="mypage-brand" href="/home">
            <MyPageLogo />
            <strong>
              Vocaloid
              <br />
              Playlist Web
            </strong>
            <span>β</span>
          </Link>
          <button aria-label="메뉴 닫기" onClick={() => setMobileMenu(false)}>
            <X />
          </button>
        </div>
        <nav aria-label="마이페이지 메뉴">
          <Link href="/home">
            <House />
            <span>홈</span>
          </Link>
          <Link href="/home">
            <AudioLines />
            <span>추천</span>
          </Link>
          <Link href="/home">
            <Search />
            <span>곡 탐색</span>
          </Link>
          <Link href="/home">
            <Music2 />
            <span>플레이리스트</span>
          </Link>
          <Link className="active" href="/mypage" aria-current="page">
            <UserRound />
            <span>마이페이지</span>
          </Link>
          <button onClick={copyProfile}>
            <Share2 />
            <span>프로필 공유</span>
          </button>
        </nav>
        <div className="mypage-sidebar-library">
          <strong>내 라이브러리</strong>
          <span>
            <Heart /> 좋아요한 곡 <em>{savedCount}</em>
          </span>
          <span>
            <Clock3 /> 최근 들은 곡
          </span>
          <span>
            <ListMusic /> 내 플레이리스트 <ChevronRight />
          </span>
        </div>
        <p className="mypage-sidebar-copy">
          <i /> 음악으로 알아가는 나의 취향<small>좋아한 이유가 쌓일수록 선명해져요.</small>
        </p>
      </aside>

      <div className="mypage-main">
        <header className="mypage-topbar">
          <button
            className="mypage-menu-button"
            aria-label="메뉴 열기"
            onClick={() => setMobileMenu(true)}
          >
            <Menu />
          </button>
          <div>
            <span>MY PAGE</span>
            <h1>마이페이지</h1>
          </div>
          <label className="mypage-search">
            <Search />
            <input aria-label="내 음악 검색" placeholder="내 음악과 플레이리스트 검색" />
          </label>
          <button className="mypage-notification" aria-label="알림">
            <Bell />
            <i />
          </button>
          <span className="mypage-top-avatar">
            <Image src="/images/miku-sunset.webp" alt="미쿠 팬 프로필" fill sizes="40px" />
          </span>
        </header>

        <main className="mypage-content">
          <section className="mypage-summary" aria-labelledby="mypage-title">
            <span className="mypage-summary-avatar">
              <Image src="/images/miku-sunset.webp" alt="미쿠 팬" fill priority sizes="88px" />
            </span>
            <div className="mypage-summary-copy">
              <span>VOCALOID LISTENER</span>
              <h2 id="mypage-title">
                미쿠_팬 <small>@miku_fan</small>
              </h2>
              <p>빠른 전개와 강한 전자음 속에서도 감정과 이야기를 찾는 리스너예요.</p>
            </div>
            <div className="mypage-stats">
              <span>
                <strong>{savedCount}</strong>
                <small>좋아요한 곡</small>
              </span>
              <span>
                <strong>{playlists.length}</strong>
                <small>플레이리스트</small>
              </span>
              <span>
                <strong>{feedbackCount}</strong>
                <small>남긴 피드백</small>
              </span>
            </div>
            <button className="mypage-outline-button">
              <UserRound /> 프로필 수정
            </button>
          </section>

          <div className="mypage-dashboard-grid">
            <section
              className="mypage-panel mypage-taste-panel"
              aria-labelledby="taste-result-title"
            >
              <header className="mypage-panel-head">
                <div>
                  <span>
                    <Sparkles />
                  </span>
                  <div>
                    <h2 id="taste-result-title">취향 진단 결과</h2>
                    <p>최근 진단 · 2026.11.10</p>
                  </div>
                </div>
                <button>
                  다시 진단하기 <ChevronRight />
                </button>
              </header>
              <div className="mypage-taste-body">
                <TasteChart />
                <div className="mypage-taste-copy">
                  <span className="mypage-result-label">YOUR MUSIC IDENTITY</span>
                  <h3>
                    감정을 밀어 올리는
                    <br />
                    <strong>네온 드라이버</strong>
                  </h3>
                  <p>
                    빠른 전개와 선명한 전자음, 감정적인 조교가 만나는 순간에 가장 크게 반응해요.
                  </p>
                  <div>
                    {tasteKeywords.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="mypage-profile-panel" aria-labelledby="profile-card-title">
              <button
                type="button"
                className="mypage-profile-card"
                onClick={() => setProfileOpen(true)}
                aria-label="프로필 카드 전체 보기"
              >
                <header>
                  <span>
                    <MyPageLogo small /> TASTE CARD
                  </span>
                  <span className="mypage-card-open">
                    전체 보기 <ChevronRight />
                  </span>
                </header>
                <div className="mypage-card-person">
                  <span>
                    <Image src="/images/miku-sunset.webp" alt="미쿠 팬" fill sizes="62px" />
                  </span>
                  <div>
                    <strong className="mypage-card-name" id="profile-card-title">
                      미쿠_팬
                    </strong>
                    <p>@miku_fan · {accountCode}</p>
                  </div>
                </div>
                <p className="mypage-card-description">
                  감정적인 보컬과 빠른 전개를 좋아하는 Vocaloid 리스너
                </p>
                <TasteChart compact />
                <div className="mypage-card-tags">
                  {tasteKeywords.slice(0, 3).map((keyword) => (
                    <span key={keyword}>{keyword}</span>
                  ))}
                </div>
                <footer>
                  <span>Vocaloid Playlist Web</span>
                  <strong>취향 일치도 86%</strong>
                </footer>
              </button>
              <button className="mypage-share-button" onClick={copyProfile}>
                <Copy /> 프로필 카드 공유하기
              </button>
            </section>

            <section className="mypage-panel mypage-recent-panel" aria-labelledby="recent-title">
              <header className="mypage-panel-head compact">
                <div>
                  <span>
                    <Clock3 />
                  </span>
                  <div>
                    <h2 id="recent-title">최근 들은 곡</h2>
                    <p>계정 데이터 예시</p>
                  </div>
                </div>
                <button>
                  전체 보기 <ChevronRight />
                </button>
              </header>
              <div className="mypage-song-list">
                {recentSongs.map((song, index) => (
                  <article key={song.id}>
                    <SongThumb song={song} priority={index === 0} />
                    <div>
                      <strong>{song.title}</strong>
                      <span>
                        {song.artist} · {song.vocalist}
                      </span>
                      <small>{index === 0 ? '12분 전' : index === 1 ? '어제' : '3일 전'}</small>
                    </div>
                    <button aria-label={`${song.title} 재생`}>
                      <Play fill="currentColor" />
                    </button>
                  </article>
                ))}
              </div>
            </section>

            <section className="mypage-panel mypage-rated-panel" aria-labelledby="rated-title">
              <header className="mypage-panel-head compact">
                <div>
                  <span>
                    <MessageSquareText />
                  </span>
                  <div>
                    <h2 id="rated-title">최근 평가한 곡</h2>
                    <p>내가 좋아한 이유</p>
                  </div>
                </div>
                <button>
                  전체 보기 <ChevronRight />
                </button>
              </header>
              <div className="mypage-rating-list">
                {sampleRatings.map(({ song, when, tags, score }) => (
                  <article key={song.id}>
                    <SongThumb song={song} />
                    <div>
                      <strong>{song.title}</strong>
                      <span>
                        {tags.map((tag) => (
                          <em key={tag}>{tag}</em>
                        ))}
                      </span>
                      <small>{when}</small>
                    </div>
                    <span className="mypage-stars" aria-label={`${score}점`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} fill={index < score ? 'currentColor' : 'none'} />
                      ))}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <section
              className="mypage-panel mypage-playlist-panel"
              aria-labelledby="playlist-title"
            >
              <header className="mypage-panel-head compact">
                <div>
                  <span>
                    <ListMusic />
                  </span>
                  <div>
                    <h2 id="playlist-title">내 플레이리스트</h2>
                    <p>{playlists.length}개의 컬렉션</p>
                  </div>
                </div>
                <button aria-label="플레이리스트 만들기">
                  <Plus />
                </button>
              </header>
              <div className="mypage-playlist-list">
                {playlists.map((playlist, index) => (
                  <article key={playlist}>
                    <span className={`mypage-playlist-cover tone-${index + 1}`}>
                      <Bookmark />
                      <small>{index === 0 ? '12곡' : index === 1 ? '8곡' : '15곡'}</small>
                    </span>
                    <div>
                      <strong>{playlist}</strong>
                      <p>
                        {index === 0
                          ? '빠른 전개 · 전자음'
                          : index === 1
                            ? '감정적인 보컬 · 조교'
                            : '몽환적 · 서정적'}
                      </p>
                      <span>{index === 0 ? '오늘 수정' : `${index + 1}일 전 수정`}</span>
                    </div>
                    <ChevronRight />
                  </article>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      {profileOpen && (
        <div
          className="mypage-profile-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setProfileOpen(false);
          }}
        >
          <section
            className="mypage-profile-full-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-full-title"
          >
            <header className="mypage-full-card-head">
              <span>
                <MyPageLogo small /> VOCALOID TASTE PROFILE
              </span>
              <div>
                <button onClick={copyProfile} aria-label="프로필 링크 복사">
                  <Link2 />
                </button>
                <button onClick={() => setProfileOpen(false)} aria-label="프로필 카드 닫기">
                  <X />
                </button>
              </div>
            </header>

            <div className="mypage-full-card-profile">
              <span className="mypage-full-card-avatar">
                <Image src="/images/miku-sunset.webp" alt="미쿠 팬" fill sizes="88px" />
              </span>
              <div>
                <small>VOCALOID LISTENER</small>
                <h2 id="profile-full-title">미쿠_팬</h2>
                <p>@miku_fan</p>
              </div>
              <span className="mypage-account-code">
                ACCOUNT CODE <strong>{accountCode}</strong>
              </span>
            </div>

            <div className="mypage-full-card-showcase">
              <section className="mypage-favorite-feature">
                <span className="mypage-feature-label">
                  <Heart fill="currentColor" /> ALL-TIME FAVORITE
                </span>
                <span className="mypage-favorite-cover">
                  <Image
                    src="/images/miku-sunset.webp"
                    alt={`${favoriteSong.title} 커버`}
                    fill
                    sizes="220px"
                  />
                  <i>01</i>
                </span>
                <div>
                  <small>최애곡</small>
                  <h3>{favoriteSong.title}</h3>
                  <blockquote>“부딪히는 마음까지도 선명한 빛이 되는 순간”</blockquote>
                </div>
              </section>

              <div className="mypage-full-chart">
                <TasteChart />
                <div>
                  <span>MY MUSIC IDENTITY</span>
                  <strong>네온 드라이버</strong>
                  <p>빠른 전개 속에서도 감정과 이야기를 놓치지 않는 취향</p>
                </div>
              </div>

              <aside className="mypage-keyword-rail">
                <small>TASTE KEYWORDS</small>
                <strong>취향 키워드</strong>
                <div>
                  {tasteKeywords.map((keyword, index) => (
                    <span key={keyword}>
                      <i>0{index + 1}</i>
                      <em>#{keyword}</em>
                    </span>
                  ))}
                </div>
              </aside>
            </div>

            <div className="mypage-full-card-meta">
              <section className="mypage-producer-feature">
                <small>좋아하는 프로듀서 · FAVORITE PRODUCERS</small>
                <div className="mypage-producer-list">
                  {favoriteProducers.map((producer, index) => (
                    <span key={producer}>
                      <i>{index + 1}</i> {producer}
                    </span>
                  ))}
                </div>
              </section>
              <section className="mypage-card-playlists">
                <small>플레이리스트 · MY PLAYLISTS</small>
                <div>
                  {playlists.map((playlist, index) => (
                    <span key={playlist}>
                      <ListMusic />
                      <strong>{playlist}</strong>
                      <em>{index === 0 ? '12곡' : index === 1 ? '8곡' : '15곡'}</em>
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <footer className="mypage-full-card-footer">
              <span>좋아한 이유로 연결되는 음악 취향</span>
              <strong>
                <MyPageLogo small /> Vocaloid Playlist Web
              </strong>
            </footer>
          </section>
        </div>
      )}
      {toast && (
        <div className="mypage-toast" role="status">
          <Check /> {toast}
        </div>
      )}
    </div>
  );
}
