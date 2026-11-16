import { Suspense } from 'react';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { StoreProvider } from './providers/StoreProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Todo List FSD',
  description: 'Next.js App Router + FSD + RTK Query + Slice + Zod',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Suspense fallback={null}>
          <StoreProvider>{children}</StoreProvider>
        </Suspense>
      </body>
    </html>
  );
}
