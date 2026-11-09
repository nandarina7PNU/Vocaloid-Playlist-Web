import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vocaloid Playlist Web · 취향으로 이어지는 음악',
  description:
    '좋아한 이유를 바탕으로, 다음에 들을 Vocaloid 곡을 찾아드려요. 나만의 취향을 발견하고 플레이리스트를 만들어 보세요.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
