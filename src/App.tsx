import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Check from '@/pages/Check';
import MessageAnalyzer from '@/pages/MessageAnalyzer';
import JobChecker from '@/pages/JobChecker';
import UrlChecker from '@/pages/UrlChecker';
import ScreenshotChecker from '@/pages/ScreenshotChecker';
import History from '@/pages/History';
import Learn from '@/pages/Learn';
import AlreadyInteracted from '@/pages/AlreadyInteracted';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/check" element={<Check />} />
            <Route path="/check/message" element={<MessageAnalyzer />} />
            <Route path="/check/job" element={<JobChecker />} />
            <Route path="/check/url" element={<UrlChecker />} />
            <Route path="/check/screenshot" element={<ScreenshotChecker />} />
            <Route path="/history" element={<History />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/already-interacted" element={<AlreadyInteracted />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
