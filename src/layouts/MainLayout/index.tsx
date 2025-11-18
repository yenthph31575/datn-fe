import type { FCC } from '@/types';
import type { ReactNode } from 'react';
import Header from './Header';
import TopBar from './TopBar';
import Footer from './Footer';
import AIChatAssistant from '@/components/AIChatAssistant';

interface Props {
  children: ReactNode;
}

const MainLayout: FCC<Props> = ({ children }) => {
  return (
    <div className="overflow-clip">
      <TopBar />
      <Header />
      <main className="">{children}</main>
      <Footer />
      <AIChatAssistant />
    </div>
  );
};

export default MainLayout;
