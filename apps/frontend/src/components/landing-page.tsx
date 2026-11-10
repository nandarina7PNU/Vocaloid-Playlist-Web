'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  AudioLines,
  BarChart3,
  Check,
  ChevronRight,
  Github,
  Headphones,
  Heart,
  Layers,
  Link2,
  ListMusic,
  Menu,
  MessageCircle,
  Music2,
  Play,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  UserRound,
  X,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: UserRound,
    tone: 'mint',
    title: '취향 온보딩',
    description: '몇 가지 선호 질문과 초기 피드백으로 당신의 취향을 빠르게 파악해요.',
  },
  {
    icon: Music2,
    tone: 'pink',
    title: '곡 피드백',
    description: '곡을 감상한 뒤, 좋아한 이유를 간단한 선택으로 남길 수 있어요.',
  },
  {
    icon: BarChart3,
    tone: 'violet',
    title: '취향 프로필',
    description: '나의 취향을 조교, 사운드, 전개, 감정 등으로 시각화해 확인할 수 있어요.',
  },
  {
    icon: Sparkles,
    tone: 'blue',
    title: '설명 가능한 추천',
    description: '추천 이유와 내 취향이 만나는 지점을 곡마다 친절한 설명으로 제공해요.',
  },
  {
    icon: Share2,
    tone: 'cyan',
    title: '프로필 공유',
    description: '내 음악적 취향을 링크로 공유해 다른 사람과 가볍게 취향을 나눌 수 있어요.',
  },
  {
    icon: ListMusic,
    tone: 'indigo',
    title: '플레이리스트',
    description: '추천 곡을 모아 나만의 Vocaloid 플레이리스트를 만들고 계속 발전시켜요.',
  },
] as const;

const steps = [
  { icon: Headphones, title: '곡 탐색 · 감상', copy: '다양한 Vocaloid 곡을 탐색하고 감상해요.' },
  {
    icon: MessageCircle,
    title: '선호와 이유 피드백',
    copy: '곡의 어떤 점이 좋았는지 간단히 선택해요.',
  },
  {
    icon: BarChart3,
    title: '취향 프로필 생성 · 갱신',
    copy: '피드백이 쌓일수록 나만의 취향이 선명해져요.',
  },
  {
    icon: Layers,
    title: '곡 특성과 유사도 분석',
    copy: '곡의 세부 특성을 분석해 내 취향과의 유사도를 계산해요.',
  },
  {
    icon: Sparkles,
    title: '추천 곡과 이유 제공',
    copy: '왜 추천하는지 설명과 함께 새로운 곡을 제안해요.',
  },
  {
    icon: RefreshCw,
    title: '결과 평가 · 교정',
    copy: '추천 결과를 다시 피드백해 취향을 더 정교하게 조정해요.',
  },
] as const;

const landingSections = [
  { id: 'top', label: '시작' },
  { id: 'difference', label: '차이점' },
  { id: 'features', label: '주요 기능' },
  { id: 'flow', label: '추천 과정' },
  { id: 'share', label: '취향 공유' },
] as const;

function WaveMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`landing-wave-mark ${compact ? 'is-compact' : ''}`} aria-hidden="true">
      {[12, 23, 31, 20, 14].map((height, index) => (
        <i key={index} style={{ height }} />
      ))}
    </span>
  );
}

function TasteRadar({ large = false }: { large?: boolean }) {
  return (
    <svg
      className={`landing-radar ${large ? 'is-large' : ''}`}
      viewBox="0 0 260 220"
      role="img"
      aria-label="빠른 전개, 강한 전자음, 감정적인 조교 성향이 높은 샘플 취향 차트"
    >
      <g className="landing-radar-grid">
        <polygon points="130,34 203,76 203,154 130,196 57,154 57,76" />
        <polygon points="130,61 177,88 177,142 130,169 83,142 83,88" />
        <polygon points="130,88 153,101 153,129 130,142 107,129 107,101" />
        <line x1="130" y1="34" x2="130" y2="196" />
        <line x1="57" y1="76" x2="203" y2="154" />
        <line x1="203" y1="76" x2="57" y2="154" />
      </g>
      <polygon
        className="landing-radar-value"
        points="130,49 185,83 192,148 130,173 77,145 70,84"
      />
      {[
        [130, 49],
        [185, 83],
        [192, 148],
        [130, 173],
        [77, 145],
        [70, 84],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="4" className="landing-radar-dot" />
      ))}
      <g className="landing-radar-labels">
        <text x="130" y="20" textAnchor="middle">
          조교 스타일
        </text>
        <text x="214" y="70">
          사운드
        </text>
        <text x="212" y="166">
          전개 속도
        </text>
        <text x="130" y="215" textAnchor="middle">
          전자음 강도
        </text>
        <text x="2" y="166">
          감정 표현
        </text>
        <text x="0" y="70">
          멜로디
        </text>
      </g>
    </svg>
  );
}

export function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('top');
  const scrollRoot = useRef<HTMLDivElement>(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const root = scrollRoot.current;
    if (!root) return;

    const sections = landingSections
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    let frame = 0;
    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const targetTop = root.getBoundingClientRect().top + (window.innerWidth <= 680 ? 68 : 78);
        const current = sections.reduce((closest, section) =>
          Math.abs(section.getBoundingClientRect().top - targetTop) <
          Math.abs(closest.getBoundingClientRect().top - targetTop)
            ? section
            : closest,
        );
        setActiveSection(current.id);
      });
    };

    updateActiveSection();
    root.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

  return (
    <div className="landing-page" ref={scrollRoot}>
      <nav className="landing-page-dots" aria-label="소개 페이지 위치">
        {landingSections.map(({ id, label }, index) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeSection === id ? 'is-active' : ''}
            aria-label={`${index + 1}번째 화면: ${label}`}
            aria-current={activeSection === id ? 'step' : undefined}
            onClick={(event) => {
              event.preventDefault();
              const root = scrollRoot.current;
              const section = document.getElementById(id);
              if (!root || !section) return;
              const headerHeight = window.innerWidth <= 680 ? 68 : 78;
              const sectionTop =
                section.getBoundingClientRect().top -
                root.getBoundingClientRect().top +
                root.scrollTop -
                headerHeight;
              setActiveSection(id);
              window.history.replaceState(null, '', `#${id}`);
              root.scrollTo({ top: sectionTop, behavior: 'smooth' });
            }}
          >
            <span />
            <em>{label}</em>
          </a>
        ))}
      </nav>
      <header className="landing-header">
        <div className="landing-header-inner">
          <Link className="landing-logo" href="#top" onClick={closeMenu} aria-label="맨 위로 이동">
            <WaveMark />
            <strong>Vocaloid Playlist Web</strong>
          </Link>

          <button
            className="landing-menu-button"
            type="button"
            aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav className={`landing-nav ${menuOpen ? 'is-open' : ''}`} aria-label="소개 페이지">
            <a href="#difference" onClick={closeMenu}>
              서비스 소개
            </a>
            <a href="#flow" onClick={closeMenu}>
              추천 방식
            </a>
            <a href="#features" onClick={closeMenu}>
              취향 프로필
            </a>
            <a href="#share" onClick={closeMenu}>
              공유
            </a>
            <Link className="landing-nav-login" href="/home" onClick={closeMenu}>
              <UserRound size={17} /> 로그인 / 시작하기
            </Link>
          </nav>
        </div>
      </header>

      <main id="top">
        <section
          className="landing-hero landing-screen"
          id="top"
          data-landing-section
          aria-labelledby="landing-title"
        >
          <Image
            className="landing-hero-art"
            src="/images/miku-sunset.webp"
            alt="보랏빛 노을 아래의 하츠네 미쿠 일러스트"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="100vw"
          />
          <div className="landing-hero-wash" />
          <div className="landing-container landing-hero-grid">
            <div className="landing-hero-copy">
              <span className="landing-kicker">
                <AudioLines size={17} /> TASTE, EXPLAINED
              </span>
              <h1 id="landing-title">
                좋아한 이유를 이해하고,
                <br />
                다음 곡으로 연결하는
                <br />
                <span>
                  Vocaloid <em>추천</em>
                </span>
              </h1>
              <p>
                단순히 비슷한 곡을 추천하는 것을 넘어,
                <br />
                당신이 어떤 점을 좋아했는지 직접 피드백하면
                <br />그 이유를 이해해 취향에 꼭 맞는 곡을 설명과 함께 추천해요.
              </p>
              <div className="landing-hero-actions">
                <Link className="landing-button primary" href="/home">
                  <Play size={18} fill="currentColor" /> 취향 분석 시작하기 <ArrowRight size={18} />
                </Link>
                <a className="landing-button secondary" href="#flow">
                  <Play size={17} /> 서비스 둘러보기
                </a>
              </div>
              <div className="landing-benefits" aria-label="핵심 장점">
                <span>
                  <Check /> 이유 기반 추천
                </span>
                <span>
                  <Check /> 콜드 스타트 대응
                </span>
                <span>
                  <Check /> 숨은 명곡 발견
                </span>
              </div>
            </div>

            <div className="landing-product-preview" aria-label="서비스 화면 미리보기">
              <div className="preview-sidebar">
                <span className="preview-brand">
                  <WaveMark compact /> Vocaloid Playlist Web
                </span>
                {[
                  [Music2, '홈'],
                  [Search, '곡 탐색'],
                  [Sparkles, '추천'],
                  [ListMusic, '플레이리스트'],
                  [UserRound, '내 취향 프로필'],
                  [Share2, '프로필 공유'],
                ].map(([Icon, label], index) => {
                  const MenuIcon = Icon as typeof Music2;
                  return (
                    <span key={label as string} className={index === 2 ? 'active' : ''}>
                      <MenuIcon size={15} /> {label as string}
                    </span>
                  );
                })}
                <AudioLines className="preview-sidebar-wave" aria-hidden="true" />
              </div>
              <div className="preview-main">
                <div className="preview-title">
                  <Sparkles size={18} /> 곡 피드백 &amp; 추천
                </div>
                <div className="preview-top-grid">
                  <div className="preview-feedback-card">
                    <small>현재 선택한 곡</small>
                    <div className="preview-song">
                      <span className="preview-cover">
                        <Image
                          src="/images/miku-sunset.webp"
                          alt=""
                          fill
                          loading="eager"
                          sizes="100px"
                        />
                        <Play size={17} fill="currentColor" />
                      </span>
                      <span>
                        <strong>네온의 파편</strong>
                        <small>보컬로이드 곡 · 3:42</small>
                        <i>
                          <span /> 0:00 / 3:42
                        </i>
                      </span>
                      <Heart size={18} />
                    </div>
                    <strong className="preview-question">이 곡을 좋아한 이유는 무엇인가요?</strong>
                    <div className="preview-tags">
                      {[
                        '조교 스타일',
                        '풍성한 사운드',
                        '빠른 전개',
                        '강한 전자음',
                        '감정적인 보컬',
                      ].map((tag, index) => (
                        <span key={tag} className={index > 1 ? 'selected' : ''}>
                          <Check /> {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="preview-profile-card">
                    <strong>
                      <BarChart3 size={16} /> 내 취향 프로필
                    </strong>
                    <TasteRadar />
                  </div>
                </div>
                <div className="preview-recommend-card">
                  <div className="preview-recommend-cover">
                    <Image
                      src="/images/miku-sunset.webp"
                      alt=""
                      fill
                      loading="eager"
                      sizes="90px"
                    />
                  </div>
                  <span>
                    <small>추천 곡</small>
                    <strong>펄스 리라이트</strong>
                    <em>보컬로이드 곡 · 3:58</em>
                  </span>
                  <p>
                    <Zap size={20} /> 빠른 전개와 강한 전자음, 감정적인 조교 취향과 잘 맞습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="landing-section landing-difference landing-screen"
          id="difference"
          data-landing-section
        >
          <div className="landing-container">
            <div className="landing-section-heading">
              <span>WHY US</span>
              <h2>무엇이 다를까요?</h2>
              <p>
                단순한 유사곡 추천이 아니라, 좋아한 <strong>이유</strong>를 이해하는 추천입니다.
              </p>
            </div>
            <div className="landing-compare">
              <article>
                <h3>
                  <Layers size={21} /> 기존 추천 <small>(일반적인 방식)</small>
                </h3>
                <ul>
                  <li>
                    <Check /> 같은 곡을 들은 다른 사용자의 취향을 기반으로 추천
                  </li>
                  <li>
                    <Check /> 많이 함께 들은 곡, 비슷한 통계 패턴의 곡을 제안
                  </li>
                  <li>
                    <Check /> 비슷한 느낌은 찾을 수 있지만 추천 이유는 알기 어려움
                  </li>
                </ul>
              </article>
              <span className="landing-vs">VS</span>
              <article className="is-highlighted">
                <h3>
                  <Sparkles size={21} /> 이유 기반 추천 <small>(Vocaloid Playlist Web)</small>
                </h3>
                <ul>
                  <li>
                    <Check /> 사용자가 직접 남긴 곡의 구체적인 매력을 학습
                  </li>
                  <li>
                    <Check /> 조교, 사운드, 전개, 감정 등 세부 특성으로 취향을 모델링
                  </li>
                  <li>
                    <Check /> 각 추천 곡이 내 취향과 맞는 이유를 설명과 함께 제공
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section
          className="landing-section landing-features landing-screen"
          id="features"
          data-landing-section
        >
          <div className="landing-container">
            <div className="landing-section-heading">
              <span>FEATURES</span>
              <h2>좋아하는 이유가, 더 좋은 발견이 되도록</h2>
              <p>Vocaloid Playlist Web이 제공하는 핵심 기능을 소개합니다.</p>
            </div>
            <div className="landing-feature-grid">
              {features.map(({ icon: Icon, tone, title, description }) => (
                <article key={title} className={`landing-feature-card ${tone}`}>
                  <span>
                    <Icon />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                  <ChevronRight aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="landing-section landing-flow landing-screen"
          id="flow"
          data-landing-section
        >
          <div className="landing-container">
            <div className="landing-section-heading">
              <span>HOW IT WORKS</span>
              <h2>추천은 이렇게 이루어져요</h2>
              <p>당신의 피드백이 쌓일수록, 더 정확하고 개인화된 추천으로 발전해요.</p>
            </div>
            <div className="landing-steps">
              {steps.map(({ icon: Icon, title, copy }, index) => (
                <div className="landing-step-wrap" key={title}>
                  <article className={`landing-step step-${index + 1}`}>
                    <span className="landing-step-number">0{index + 1}</span>
                    <Icon />
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </article>
                  {index < steps.length - 1 && <ArrowRight className="landing-step-arrow" />}
                </div>
              ))}
            </div>
            <div className="landing-discovery-note">
              <Zap />
              <p>
                <strong>청취 기록이 없어도 괜찮아요.</strong>몇 곡의 이유 피드백만으로 추천을
                시작하고, 인지도가 낮은 곡도 음악적 특성이 맞으면 발견할 수 있어요.
              </p>
            </div>
          </div>
        </section>

        <section className="landing-share landing-screen" id="share" data-landing-section>
          <div className="landing-share-glow" />
          <div className="landing-container landing-share-grid">
            <div className="landing-share-copy">
              <span>
                <Share2 /> SHARE YOUR TASTE
              </span>
              <h2>
                내 취향 프로필을 공유하고,
                <br />
                함께 취향을 나눠요
              </h2>
              <p>
                나의 Vocaloid 취향을 프로필로 정리해 링크로 공유하고,
                <br />
                비슷한 취향의 사람들과 곡을 추천 주고받아 보세요.
              </p>
              <Link className="landing-button primary" href="/home">
                <Link2 size={18} /> 내 취향 프로필 만들고 공유하기 <ArrowRight size={18} />
              </Link>
            </div>
            <div className="landing-profile-card">
              <div className="landing-profile-card-top">
                <small>
                  공유된 취향 프로필 <span>(예시)</span>
                </small>
                <button type="button" aria-label="더보기">
                  •••
                </button>
              </div>
              <div className="landing-profile-person">
                <span className="landing-profile-avatar">
                  <Image
                    src="/images/miku-sunset.webp"
                    alt="샘플 프로필"
                    fill
                    loading="eager"
                    sizes="76px"
                  />
                </span>
                <span>
                  <strong>
                    미쿠_팬 <Link2 size={15} />
                  </strong>
                  <p>빠른 전개와 강한 전자음, 감정적인 조교를 좋아하는 Vocaloid 리스너예요. ✨</p>
                </span>
              </div>
              <div className="landing-profile-tags">
                {['전자음 선호', '빠른 BPM', '감정적인 조교', '서정적 후렴'].map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="landing-profile-detail">
                <TasteRadar large />
                <div>
                  <small>
                    자주 듣는 곡 <span>(선호곡)</span>
                  </small>
                  {['네온의 파편', '펄스 리라이트', '새벽의 컨스텔레이션'].map((song, index) => (
                    <span key={song}>
                      <Play size={13} fill="currentColor" />
                      <strong>{song}</strong>
                      <em>{index === 0 ? '3:42' : index === 1 ? '3:58' : '4:21'}</em>
                      <Heart size={13} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <footer className="landing-footer">
            <div className="landing-container landing-footer-grid">
              <div>
                <Link className="landing-logo" href="#top">
                  <WaveMark />
                  <strong>Vocaloid Playlist Web</strong>
                </Link>
                <p>좋아한 이유를 이해하는, 더 깊이 있는 Vocaloid 추천</p>
              </div>
              <div>
                <strong>제품</strong>
                <a href="#difference">서비스 소개</a>
                <a href="#flow">추천 방식</a>
                <a href="#features">취향 프로필</a>
              </div>
              <div>
                <strong>프로젝트</strong>
                <Link href="/home">서비스 체험</Link>
                <a
                  href="https://github.com/nandarina7PNU/Vocaloid-Playlist-Web/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noreferrer"
                >
                  기여 가이드
                </a>
                <a
                  href="https://github.com/nandarina7PNU/Vocaloid-Playlist-Web#readme"
                  target="_blank"
                  rel="noreferrer"
                >
                  프로젝트 소개
                </a>
              </div>
              <a
                className="landing-github"
                href="https://github.com/nandarina7PNU/Vocaloid-Playlist-Web"
                target="_blank"
                rel="noreferrer"
              >
                <Github />
                <span>
                  <strong>GitHub에서 프로젝트를 확인하세요</strong>
                  <small>오픈소스와 개발 정보를 공개하고 있어요.</small>
                </span>
                <ArrowRight />
              </a>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
}
