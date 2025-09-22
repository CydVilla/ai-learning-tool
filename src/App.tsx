import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/Common/ErrorBoundary';
import PageLoader from './components/Common/PageLoader';
import { UserProgressProvider } from './context/UserProgressContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import Home from './pages/Home';
import HTMLTrack from './pages/HTMLTrack';
import CSSTrack from './pages/CSSTrack';
import JavaScriptTrack from './pages/JavaScriptTrack';
import AICustomTrack from './pages/AICustomTrack';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <UserProgressProvider>
          <Router basename="/ai-learning-tool">
            <Layout>
              <Suspense fallback={<PageLoader />}>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/html" element={<HTMLTrack />} />
                          <Route path="/css" element={<CSSTrack />} />
                          <Route path="/javascript" element={<JavaScriptTrack />} />
                          <Route path="/ai-custom" element={<AICustomTrack />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
              </Suspense>
            </Layout>
          </Router>
        </UserProgressProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
}

export default App;
