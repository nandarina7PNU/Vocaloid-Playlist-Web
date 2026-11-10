'use client';

import Image from 'next/image';
import NextLink from 'next/link';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import {
  ArrowRight,
  AudioLines,
  Bell,
  Bookmark,
  ChartNoAxesColumnIncreasing,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  Cloud,
  Copy,
  ExternalLink,
  Headphones,
  Heart,
  House,
  Link,
  ListMusic,
  Menu,
  Music2,
  Play,
  Plus,
  Search,
  Share2,
  Sparkles,
  Tag,
  UserRound,
  X,
  Zap,
  BookOpen,
} from 'lucide-react';
import { songs, tasteKeywords, type Song } from '@/lib/songs';

type View =
  '홈' | '추천' | '곡 탐색' | '플레이리스트' | '좋아요한 곡' | '최근 들은 곡' | '내 플레이리스트';
type Modal =
  | { type: 'song'; song: Song }
  | { type: 'profile' | 'share' | 'playlist' }
  | { type: 'info'; title: string; description: string }
  | null;

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('vocaloid-storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('vocaloid-storage', callback);
  };
}

function useStoredList(key: string): [string[], (items: string[]) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => {
      try {
        return localStorage.getItem(key) ?? '[]';
      } catch {
        return '[]';
      }
    },
    () => '[]',
  );
  const items = useMemo<string[]>(() => {
    try {
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((item): item is string => typeof item === 'string')
        : [];
    } catch {
      return [];
    }
  }, [raw]);
  return [
    items,
    (next) => {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* Session remains usable with storage disabled. */
      }
      window.dispatchEvent(new Event('vocaloid-storage'));
    },
  ];
}

function WaveLogo({ small = false }: { small?: boolean }) {
  return (
    <span className={`wave-logo ${small ? 'small' : ''}`} aria-hidden="true">
      {[16, 29, 40, 24].map((height, i) => (
        <i key={i} style={{ height }} />
      ))}
    </span>
  );
}

function TasteChart() {
  const center = { x: 165, y: 130 };
  const point = (index: number, radius: number) => {
    const angle = ((-90 + (index * 360) / 7) * Math.PI) / 180;
    return `${center.x + Math.cos(angle) * radius},${center.y + Math.sin(angle) * radius}`;
  };
  const values = [72, 65, 74, 55, 71, 73, 69];
  return (
    <svg
      className="taste-chart"
      viewBox="0 0 330 265"
      role="img"
      aria-label="샘플 취향 차트: 보컬 72, 멜로디와 화성 65, 리듬과 속도 74, 편곡과 사운드 55, 가사와 주제 71, 분위기 73, 구성 69점"
    >
      {[1, 0.75, 0.5, 0.25].map((scale) => (
        <polygon
          key={scale}
          points={Array.from({ length: 7 }, (_, i) => point(i, 94 * scale)).join(' ')}
          className="chart-grid"
        />
      ))}
      {values.map((_, i) => (
        <line
          key={i}
          x1={center.x}
          y1={center.y}
          x2={point(i, 94).split(',')[0]}
          y2={point(i, 94).split(',')[1]}
          className="chart-axis"
        />
      ))}
      <polygon
        points={values.map((value, i) => point(i, value)).join(' ')}
        className="chart-value"
      />
      {values.map((value, i) => (
        <circle
          key={i}
          cx={point(i, value).split(',')[0]}
          cy={point(i, value).split(',')[1]}
          r="3.1"
          className="chart-dot"
        />
      ))}
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
    </svg>
  );
}

function SongCard({
  song,
  saved,
  onSave,
  onPlay,
  onTag,
}: {
  song: Song;
  saved: boolean;
  onSave: () => void;
  onPlay: () => void;
  onTag: (tag: string) => void;
}) {
  return (
    <article className={`song-card ${song.tone}`}>
      <div className="song-art">
        {/* YouTube thumbnails remain hosted by YouTube; no copyrighted artwork is bundled. */}
        <Image
          unoptimized
          width={480}
          height={360}
          src={`https://i.ytimg.com/vi/${song.id}/hqdefault.jpg`}
          alt={`${song.title} 공식 영상 썸네일`}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.opacity = '0';
          }}
        />
        <Music2 className="art-fallback" aria-hidden="true" />
        <button
          className={`bookmark-button ${saved ? 'is-saved' : ''}`}
          onClick={onSave}
          aria-label={`${song.title} ${saved ? '저장 취소' : '저장'}`}
          aria-pressed={saved}
        >
          <Bookmark size={20} fill={saved ? 'currentColor' : 'none'} />
        </button>
        <button className="play-button" onClick={onPlay} aria-label={`${song.title} 재생`}>
          <Play size={20} fill="currentColor" />
        </button>
        <span className="duration">{song.duration}</span>
      </div>
      <div className="song-body">
        <button className="song-title" onClick={onPlay}>
          {song.title}
        </button>
        <p className="artist">{song.artist}</p>
        <div className="song-tags">
          {song.tags.slice(0, 3).map((tag) => (
            <button key={tag} onClick={() => onTag(tag)}>
              #
              {tag === '감정적인 보컬'
                ? '감정보컬'
                : tag === '강한 전자음'
                  ? '전자음'
                  : tag.replaceAll(' ', '')}
            </button>
          ))}
        </div>
        <div className="recommend-reason">
          <Sparkles size={17} />
          <p>{song.reason}</p>
        </div>
      </div>
    </article>
  );
}

export function MusicDashboard() {
  const [view, setView] = useState<View>('홈');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('');
  const [mode, setMode] = useState<'taste' | 'discover'>('taste');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [modal, setModal] = useState<Modal>(null);
  const [playlistName, setPlaylistName] = useState('');
  const [toast, setToast] = useState('');
  const [saved, setSaved] = useStoredList('vocaloid-saved');
  const [recent, setRecent] = useStoredList('vocaloid-recent');
  const [playlists, setPlaylists] = useStoredList('vocaloid-playlists');
  const carousel = useRef<HTMLDivElement>(null);
  const searchInput = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (modal) dialog.current?.showModal();
    else dialog.current?.close();
  }, [modal]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 3200);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        event.key === '/' &&
        !(
          target instanceof HTMLElement &&
          (target.matches('input, textarea, select') || target.isContentEditable)
        ) &&
        !dialog.current?.open
      ) {
        event.preventDefault();
        searchInput.current?.focus();
      }
    };
    window.addEventListener('keydown', focusSearch);
    return () => window.removeEventListener('keydown', focusSearch);
  }, []);

  const navigate = (next: View) => {
    setView(next);
    setQuery('');
    setFilter('');
    setMobileMenu(false);
    if (next === '곡 탐색') searchInput.current?.focus();
  };
  const play = (song: Song) => {
    setRecent([song.id, ...recent.filter((id) => id !== song.id)].slice(0, 30));
    setModal({ type: 'song', song });
  };
  const save = (song: Song) => {
    setSaved(saved.includes(song.id) ? saved.filter((id) => id !== song.id) : [...saved, song.id]);
    setToast(saved.includes(song.id) ? '저장한 곡에서 삭제했어요.' : '좋아요한 곡에 저장했어요.');
  };
  const chooseFilter = (tag: string) => {
    setFilter((current) => (current === tag ? '' : tag));
    carousel.current?.scrollTo({ left: 0 });
  };
  const libraryView = ['좋아요한 곡', '플레이리스트', '내 플레이리스트'].includes(view);
  const results = useMemo(() => {
    let list = mode === 'discover' ? [...songs].reverse() : songs;
    if (libraryView) list = list.filter((song) => saved.includes(song.id));
    if (view === '최근 들은 곡')
      list = recent
        .map((id) => songs.find((song) => song.id === id))
        .filter((song): song is Song => Boolean(song));
    if (filter) list = list.filter((song) => song.tags.includes(filter));
    if (query.trim()) {
      const term = query.trim().toLocaleLowerCase();
      list = list.filter((song) =>
        [song.title, song.artist, song.vocalist, ...song.tags]
          .join(' ')
          .toLocaleLowerCase()
          .includes(term),
      );
    }
    return list;
  }, [mode, libraryView, saved, recent, view, filter, query]);
  const sectionTitle = query
    ? `“${query}” 검색 결과`
    : filter
      ? `${filter}, 이런 곡은 어때요?`
      : view === '홈' || view === '추천'
        ? '지금, 당신을 위한 추천곡'
        : view;
  const info = (title: string, description: string) =>
    setModal({ type: 'info', title, description });

  return (
    <>
      <div className="app-shell">
        {mobileMenu && (
          <button
            className="sidebar-scrim"
            aria-label="메뉴 닫기"
            onClick={() => setMobileMenu(false)}
          />
        )}
        <aside className={`sidebar ${mobileMenu ? 'open' : ''}`}>
          <button
            className="brand"
            onClick={() => navigate('홈')}
            aria-label="Vocaloid Playlist Web 홈"
          >
            <WaveLogo />
            <span>
              Vocaloid
              <br />
              Playlist Web
            </span>
            <span className="beta">β</span>
          </button>
          <nav aria-label="메인 메뉴" className="main-nav">
            {(
              [
                { label: '홈', icon: House },
                { label: '추천', icon: AudioLines },
                { label: '곡 탐색', icon: Search },
                { label: '플레이리스트', icon: Music2 },
              ] as const
            ).map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={`nav-item ${view === label ? 'active' : ''}`}
                onClick={() => navigate(label)}
                aria-current={view === label ? 'page' : undefined}
              >
                <Icon />
                <span>{label}</span>
                {label === '추천' && <span className="nav-new">NEW</span>}
              </button>
            ))}
            <NextLink className="nav-item" href="/mypage" onClick={() => setMobileMenu(false)}>
              <UserRound />
              <span>취향 프로필</span>
            </NextLink>
            <button
              className="nav-item"
              onClick={() => {
                setModal({ type: 'share' });
                setMobileMenu(false);
              }}
            >
              <Link />
              <span>프로필 공유</span>
            </button>
          </nav>
          <div className="library-label">
            <span>내 라이브러리</span>
            <button aria-label="플레이리스트 만들기" onClick={() => setModal({ type: 'playlist' })}>
              <Plus size={20} />
            </button>
          </div>
          <nav aria-label="내 라이브러리" className="library-nav">
            {(
              [
                { label: '좋아요한 곡', icon: Heart },
                { label: '최근 들은 곡', icon: Clock3 },
                { label: '내 플레이리스트', icon: ListMusic },
              ] as const
            ).map(({ label, icon: Icon }) => (
              <button
                key={label}
                className={`nav-item ${view === label ? 'active' : ''}`}
                onClick={() => navigate(label)}
              >
                <Icon />
                <span>{label}</span>
                {label === '좋아요한 곡' && saved.length > 0 && (
                  <span className="nav-count">{saved.length}</span>
                )}
                {label === '내 플레이리스트' && <ChevronRight className="nav-chevron" size={16} />}
              </button>
            ))}
          </nav>
          <div className="sidebar-note">
            <span className="status-dot" />
            음악으로 알아가는 나의 취향<p>조금 더 나다운 플레이리스트.</p>
          </div>
        </aside>

        <div className="main-shell">
          <header className="topbar">
            <button
              className="icon-button menu-toggle"
              aria-label="메뉴 열기"
              onClick={() => setMobileMenu(true)}
            >
              <Menu />
            </button>
            <div className="search-field">
              <Search size={22} />
              <input
                ref={searchInput}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="곡, 프로듀서, 보컬로이드 검색"
                placeholder="곡, 프로듀서, 보컬로이드 검색 (예: DECO*27, 하츠네 미쿠, すりぃ)"
              />
              {query && (
                <button aria-label="검색어 지우기" onClick={() => setQuery('')}>
                  <X size={17} />
                </button>
              )}
              <kbd>/</kbd>
            </div>
            <div className="header-actions">
              <div className="notification-wrap">
                <button
                  className="icon-button notification-button"
                  aria-label="알림"
                  aria-expanded={notifications}
                  onClick={() => setNotifications(!notifications)}
                >
                  <Bell size={24} />
                  <i />
                </button>
                {notifications && (
                  <div className="notification-popover">
                    <strong>알림</strong>
                    <p>
                      <Sparkles size={18} />
                      새로운 음악을 만날 준비가 됐어요.
                    </p>
                    <span>좋아하는 곡을 저장하고 나만의 목록을 만들어 보세요.</span>
                  </div>
                )}
              </div>
              <span className="header-divider" />
              <button
                className="profile-button"
                onClick={() => setModal({ type: 'profile' })}
                aria-label="내 취향 프로필 열기"
              >
                <span className="avatar">
                  <Image src="/images/miku-sunset.webp" alt="" fill sizes="42px" />
                </span>
                <ChevronDown size={18} />
              </button>
            </div>
          </header>

          <main className="workspace">
            <div className="main-column">
              <section className="hero" aria-labelledby="hero-title">
                <Image
                  className="hero-image"
                  src="/images/miku-sunset.webp"
                  alt="보랏빛 노을 아래 음악을 듣는 하츠네 미쿠"
                  fill
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 900px) 100vw, 75vw"
                />
                <div className="hero-shade" />
                <div className="hero-content">
                  <span className="hero-eyebrow">YOUR NEXT FAVORITE STARTS HERE</span>
                  <h1 id="hero-title">
                    당신의 취향을 더 잘 이해하는
                    <br />
                    <span>Vocaloid 추천</span>
                    <AudioLines className="hero-wave" />
                  </h1>
                  <p>좋아한 이유를 바탕으로, 다음에 들을 곡을 찾아드려요.</p>
                  <div className="hero-steps">
                    <button
                      onClick={() =>
                        info(
                          '좋아한 이유를 남겨요',
                          '곡을 재생한 뒤 좋아한 음악적 요소를 살펴보세요. 지금은 예시 태그로 취향별 곡을 탐색할 수 있어요.',
                        )
                      }
                    >
                      <Tag />
                      <span>이유를 남기고</span>
                    </button>
                    <i>＋</i>
                    <button onClick={() => setModal({ type: 'profile' })}>
                      <ChartNoAxesColumnIncreasing />
                      <span>취향을 분석해</span>
                    </button>
                    <i>＋</i>
                    <button
                      onClick={() => {
                        navigate('추천');
                        document
                          .getElementById('recommendations')
                          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }}
                    >
                      <Headphones />
                      <span>맞는 곡을 추천</span>
                    </button>
                  </div>
                </div>
              </section>

              <div className="content-stack">
                <section
                  className="recommendation-panel panel"
                  id="recommendations"
                  aria-labelledby="recommendation-title"
                >
                  <div className="section-heading">
                    <h2 id="recommendation-title">
                      <Sparkles className="accent-icon" />
                      {sectionTitle}
                      <button
                        className="help-button"
                        aria-label="추천곡 안내"
                        onClick={() =>
                          info(
                            '좋아한 이유에서 시작하는 추천',
                            '현재 화면의 추천곡, 취향 차트, 피드백은 화면 체험을 위한 샘플 데이터예요. 검색·태그 필터·곡 저장은 브라우저에서 동작하며, 실제 취향 분석과 개인화 추천은 추후 서버와 연결할 예정이에요.',
                          )
                        }
                      >
                        <CircleHelp size={19} />
                      </button>
                    </h2>
                    <div className="segment-control" aria-label="추천 방식">
                      <button
                        className={mode === 'taste' ? 'selected' : ''}
                        onClick={() => setMode('taste')}
                        aria-pressed={mode === 'taste'}
                      >
                        내 취향 기반
                      </button>
                      <button
                        className={mode === 'discover' ? 'selected' : ''}
                        onClick={() => setMode('discover')}
                        aria-pressed={mode === 'discover'}
                      >
                        새로운 탐색
                      </button>
                    </div>
                  </div>
                  {(filter || query) && (
                    <div className="filter-summary">
                      <span>{results.length}개의 곡을 찾았어요</span>
                      <button
                        onClick={() => {
                          setFilter('');
                          setQuery('');
                        }}
                      >
                        필터 초기화 <X size={13} />
                      </button>
                    </div>
                  )}
                  {view === '내 플레이리스트' && (
                    <div className="playlist-list">
                      {playlists.map((name) => (
                        <span key={name}>
                          <ListMusic size={17} />
                          {name}
                          <button
                            aria-label={`${name} 삭제`}
                            onClick={() => setPlaylists(playlists.filter((item) => item !== name))}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                      <button onClick={() => setModal({ type: 'playlist' })}>
                        <Plus size={16} />새 플레이리스트
                      </button>
                      <small>저장한 곡을 함께 모아 보여드려요.</small>
                    </div>
                  )}
                  {results.length ? (
                    <div className="carousel-wrap">
                      <div className="song-carousel" ref={carousel}>
                        {results.map((song) => (
                          <SongCard
                            key={song.id}
                            song={song}
                            saved={saved.includes(song.id)}
                            onSave={() => save(song)}
                            onPlay={() => play(song)}
                            onTag={chooseFilter}
                          />
                        ))}
                      </div>
                      <button
                        className="carousel-next"
                        aria-label="다음 추천곡"
                        onClick={() => {
                          const el = carousel.current;
                          if (el)
                            el.scrollTo({
                              left:
                                el.scrollLeft + el.clientWidth >= el.scrollWidth - 5
                                  ? 0
                                  : el.scrollLeft + 288,
                              behavior: 'smooth',
                            });
                        }}
                      >
                        <ChevronRight size={25} />
                      </button>
                    </div>
                  ) : (
                    <div className="empty-state">
                      <Music2 size={35} />
                      <h3>
                        {libraryView
                          ? '좋아하는 곡을 모아 보세요'
                          : view === '최근 들은 곡'
                            ? '아직 감상한 곡이 없어요'
                            : '일치하는 곡을 찾지 못했어요'}
                      </h3>
                      <p>
                        {libraryView
                          ? '추천곡의 북마크를 누르면 이곳에 저장돼요.'
                          : view === '최근 들은 곡'
                            ? '추천곡의 재생 버튼으로 첫 음악을 만나 보세요.'
                            : '다른 검색어나 취향 키워드로 다시 찾아보세요.'}
                      </p>
                      <button onClick={() => navigate('홈')}>
                        추천곡 둘러보기 <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </section>

                <section className="discovery-panel panel" aria-labelledby="discovery-title">
                  <h2 id="discovery-title">
                    <Sparkles className="accent-icon" size={20} />
                    다음은 이런 곡도 어때요?
                  </h2>
                  <div className="discovery-row">
                    <div className="discovery-tags">
                      {[
                        { label: '빠른 전개', icon: Zap },
                        { label: '강한 전자음', icon: AudioLines },
                        { label: '감정적인 보컬', icon: Headphones },
                        { label: '서사적인 가사', icon: BookOpen },
                        { label: '어두운 분위기', icon: Cloud },
                      ].map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          className={filter === label ? 'active' : ''}
                          onClick={() => chooseFilter(label)}
                          aria-pressed={filter === label}
                        >
                          <Icon size={19} />
                          {label}
                        </button>
                      ))}
                    </div>
                    <button
                      className="more-link"
                      onClick={() => {
                        setMode('discover');
                        navigate('곡 탐색');
                      }}
                    >
                      더 다양한 추천 보기 <ArrowRight size={17} />
                    </button>
                  </div>
                </section>
              </div>
            </div>

            <aside className="insights" aria-label="나의 취향 요약">
              <section className="taste-panel panel">
                <button className="aside-heading" onClick={() => setModal({ type: 'profile' })}>
                  <span>
                    <Sparkles size={20} />내 취향 한눈에 보기
                  </span>
                  <ChevronRight size={20} />
                </button>
                <TasteChart />
                <div className="keyword-section">
                  <h3>
                    <AudioLines size={19} />내 취향 키워드<span className="sample-badge">예시</span>
                  </h3>
                  <div className="keyword-tags">
                    {tasteKeywords.map((tag) => (
                      <button
                        key={tag}
                        className={filter === tag ? 'active' : ''}
                        onClick={() => chooseFilter(tag)}
                      >
                        #{tag === '감정적인 보컬' ? '감정적인 조교' : tag}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
              <section className="feedback-panel panel">
                <button
                  className="aside-heading"
                  onClick={() =>
                    info(
                      '피드백 예시',
                      '“가사 주제, 멜로디 전개가 좋아요!”처럼 곡을 좋아한 이유를 모아 취향을 이해해요. 현재 표시된 피드백은 서비스의 모습을 보여주는 예시예요.',
                    )
                  }
                >
                  <span>
                    <Clock3 size={19} />
                    최근에 남긴 피드백
                  </span>
                  <ChevronRight size={20} />
                </button>
                <button className="feedback-content" onClick={() => play(songs[4])}>
                  <span className="feedback-art">
                    <Image
                      unoptimized
                      width={120}
                      height={90}
                      src="https://i.ytimg.com/vi/8oBV3jPTW4s/default.jpg"
                      alt="로스트 원의 호곡 썸네일"
                      loading="lazy"
                    />
                  </span>
                  <span className="feedback-copy">
                    <strong>ロストワンの号哭</strong>
                    <small>Neru</small>
                    <span className="feedback-quote">가사 주제, 멜로디 전개가 좋아요!</span>
                  </span>
                  <span className="like-badge">
                    <Heart size={12} fill="currentColor" />
                    좋아요
                  </span>
                </button>
              </section>
              <button className="share-panel panel" onClick={() => setModal({ type: 'share' })}>
                <span className="share-text">
                  <strong>
                    <Share2 size={22} />내 프로필 공유하기
                  </strong>
                  <span>
                    내 취향과 좋아하는 곡을
                    <br />
                    친구에게 소개해 보세요.
                  </span>
                  <small>
                    취향이 닮은 친구를 만나는 방법 <ArrowRight size={14} />
                  </small>
                </span>
                <span className="share-illustration" aria-hidden="true">
                  <span className="mini-profile">
                    <i />
                    <i />
                    <i />
                    <Link size={36} />
                  </span>
                  <Sparkles className="share-sparkle" size={23} />
                </span>
              </button>
            </aside>
          </main>
        </div>
      </div>

      <footer className="footer">
        <button className="footer-brand" onClick={() => navigate('홈')}>
          <WaveLogo small />
          <strong>Vocaloid Playlist Web</strong>
          <span className="beta">β</span>
        </button>
        <span className="footer-tagline">보컬로이드 음악을 더 깊이, 더 많이, 더 나답게.</span>
        <div className="footer-links">
          {['서비스 소개', '이용 가이드', '개인정보 처리방침', '이용약관', '고객센터'].map(
            (label) => (
              <button
                key={label}
                onClick={() =>
                  info(
                    label,
                    label === '서비스 소개'
                      ? 'Vocaloid Playlist Web은 좋아한 노래의 이유를 이해하고, 그 취향을 다음 곡으로 연결하는 음악 추천 서비스를 만들고 있어요.'
                      : label === '이용 가이드'
                        ? '검색창에서 곡이나 프로듀서를 찾고, 취향 태그로 필터링해 보세요. 북마크로 곡을 저장할 수 있고, 재생 버튼을 누르면 공식 YouTube 영상이 열려요.'
                        : label === '개인정보 처리방침'
                          ? '현재 프런트엔드 데모는 계정 정보를 수집하지 않아요. 저장한 곡, 재생 기록, 플레이리스트 이름은 이 브라우저의 로컬 저장소에만 보관돼요. 외부 YouTube 영상을 재생하면 YouTube의 개인정보 처리방침이 적용돼요.'
                          : label === '이용약관'
                            ? '서비스는 현재 개발 중인 데모예요. 곡과 영상의 권리는 각 권리자에게 있으며, 공식 YouTube 서비스를 통해 감상할 수 있어요.'
                            : '서비스는 현재 개발 중이에요. 오류와 제안은 프로젝트 GitHub 저장소의 Issues에 남겨 주세요.',
                  )
                }
              >
                {label}
              </button>
            ),
          )}
        </div>
        <div className="social-links">
          <a
            href="https://www.youtube.com/@DECO27"
            target="_blank"
            rel="noreferrer"
            aria-label="DECO*27 공식 YouTube"
          >
            <Play size={19} fill="currentColor" />
          </a>
          <a
            href="https://github.com/nandarina7PNU/Vocaloid-Playlist-Web"
            target="_blank"
            rel="noreferrer"
            aria-label="프로젝트 GitHub"
          >
            <ExternalLink size={19} />
          </a>
        </div>
      </footer>

      {toast && (
        <div role="status" className="toast">
          <Check size={18} />
          {toast}
        </div>
      )}
      <dialog
        ref={dialog}
        className={`modal ${modal?.type === 'song' ? 'player-modal' : ''}`}
        onCancel={() => setModal(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setModal(null);
        }}
        aria-labelledby="modal-title"
      >
        <button
          className="modal-close icon-button"
          aria-label="닫기"
          onClick={() => setModal(null)}
        >
          <X />
        </button>
        {modal?.type === 'song' && (
          <>
            <span className="modal-eyebrow">
              <Headphones size={16} />
              OFFICIAL MUSIC VIDEO
            </span>
            <h2 id="modal-title">{modal.song.title}</h2>
            <p className="modal-subtitle">
              {modal.song.artist} · {modal.song.vocalist}
            </p>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${modal.song.id}?autoplay=1`}
              title={`${modal.song.title} 공식 YouTube 플레이어`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <div className="player-actions">
              <button className="primary-button" onClick={() => save(modal.song)}>
                <Bookmark size={17} />
                {saved.includes(modal.song.id) ? '저장 취소' : '좋아요한 곡에 저장'}
              </button>
              <a
                href={`https://www.youtube.com/watch?v=${modal.song.id}`}
                target="_blank"
                rel="noreferrer"
              >
                YouTube에서 보기 <ExternalLink size={15} />
              </a>
            </div>
            <div className="modal-reason">
              <Sparkles size={19} />
              <p>{modal.song.reason}</p>
            </div>
          </>
        )}
        {modal?.type === 'profile' && (
          <>
            <span className="modal-eyebrow">
              <Sparkles size={16} />
              YOUR MUSIC IDENTITY
            </span>
            <h2 id="modal-title">나를 닮은 음악의 모양</h2>
            <p className="modal-subtitle">이런 취향 프로필을 만들 수 있어요. 현재는 예시예요.</p>
            <TasteChart />
            <div className="keyword-tags">
              {tasteKeywords.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    chooseFilter(tag);
                    setModal(null);
                  }}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <p className="profile-description">
              강렬한 사운드 속에서도 감정과 이야기를 찾는 취향.
              <br />
              노래를 좋아한 이유가 쌓일수록 더 선명해져요.
            </p>
            <button
              className="primary-button full-width"
              onClick={() => {
                setModal(null);
                navigate('좋아요한 곡');
              }}
            >
              <Heart size={18} />
              내가 저장한 {saved.length}곡 보기
            </button>
          </>
        )}
        {modal?.type === 'share' && (
          <>
            <span className="modal-eyebrow">
              <Share2 size={16} />
              MUSIC CONNECTS US
            </span>
            <h2 id="modal-title">음악 취향으로 가까워져요</h2>
            <p className="modal-subtitle">좋아요한 곡 목록을 복사해 친구에게 전해 보세요.</p>
            <div className="share-preview">
              <WaveLogo small />
              <strong>나의 Vocaloid 플레이리스트</strong>
              <p>
                {saved.length
                  ? `${saved.length}곡에 담긴 나의 취향`
                  : '아직 저장한 곡이 없어요. 먼저 좋아하는 곡을 골라 주세요.'}
              </p>
              {songs
                .filter((song) => saved.includes(song.id))
                .map((song) => (
                  <div key={song.id}>
                    <Music2 size={15} />
                    <span>{song.title}</span>
                    <small>{song.artist}</small>
                  </div>
                ))}
            </div>
            <button
              className="primary-button full-width"
              disabled={!saved.length}
              onClick={async () => {
                const text =
                  '나의 Vocaloid 플레이리스트 🎧\n\n' +
                  songs
                    .filter((song) => saved.includes(song.id))
                    .map(
                      (song) =>
                        `${song.title} — ${song.artist}\nhttps://www.youtube.com/watch?v=${song.id}`,
                    )
                    .join('\n\n');
                try {
                  await navigator.clipboard.writeText(text);
                  setToast('플레이리스트를 복사했어요. 친구에게 붙여넣어 보세요!');
                } catch {
                  setToast('복사할 수 없어요. 브라우저의 클립보드 권한을 확인해 주세요.');
                }
              }}
            >
              <Copy size={17} />곡 목록 복사하기
            </button>
            <p className="privacy-note">선택한 곡만 복사해요. 재생 기록은 포함하지 않아요.</p>
          </>
        )}
        {modal?.type === 'playlist' && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const name = playlistName.trim();
              if (!name) return;
              if (playlists.includes(name)) {
                setToast('같은 이름의 플레이리스트가 있어요.');
                return;
              }
              setPlaylists([...playlists, name]);
              setPlaylistName('');
              setModal(null);
              navigate('내 플레이리스트');
              setToast('새 플레이리스트를 만들었어요.');
            }}
          >
            <span className="modal-eyebrow">
              <ListMusic size={16} />
              YOUR OWN COLLECTION
            </span>
            <h2 id="modal-title">새 플레이리스트</h2>
            <p className="modal-subtitle">좋아하는 음악을 담을 이름을 지어 주세요.</p>
            <label className="playlist-input">
              플레이리스트 이름
              <input
                value={playlistName}
                onChange={(event) => setPlaylistName(event.target.value)}
                placeholder="예: 밤 산책에 듣는 보컬로이드"
                required
                maxLength={40}
              />
            </label>
            <p className="privacy-note">현재 데모에서는 저장한 곡을 공통으로 표시해요.</p>
            <button className="primary-button full-width" type="submit">
              <Plus size={18} />
              만들기
            </button>
          </form>
        )}
        {modal?.type === 'info' && (
          <>
            <span className="modal-eyebrow">
              <CircleHelp size={16} />
              VOCALOID PLAYLIST WEB
            </span>
            <h2 id="modal-title">{modal.title}</h2>
            <p className="info-description">{modal.description}</p>
            {modal.title === '고객센터' && (
              <a
                className="primary-button"
                href="https://github.com/nandarina7PNU/Vocaloid-Playlist-Web/issues"
                target="_blank"
                rel="noreferrer"
              >
                GitHub Issues <ExternalLink size={16} />
              </a>
            )}
            <button className="text-button" onClick={() => setModal(null)}>
              <ChevronLeft size={16} />
              음악으로 돌아가기
            </button>
          </>
        )}
      </dialog>
    </>
  );
}
