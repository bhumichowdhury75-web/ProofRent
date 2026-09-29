import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { TenantDashboardPage } from './pages/TenantDashboardPage';
import { VerifyProofPage } from './pages/VerifyProofPage';
import { RequestsPage } from './pages/RequestsPage';
import { IssueCredentialPage } from './pages/IssueCredentialPage';
import { AdminDeployPage } from './pages/AdminDeployPage';
import { useWallet } from './contexts/WalletContext';

export function App() {
  const { isConnected } = useWallet();

  return (
    <div className="pr-app-shell">
      <a href="#main-content" className="pr-skip-link">Skip to main content</a>
      <Navbar />

      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Routes>
          <Route path="/" element={isConnected ? <TenantDashboardPage /> : <LandingPage />} />
          <Route path="/overview" element={<TenantDashboardPage />} />
          <Route path="/verify" element={<VerifyProofPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/issue" element={<IssueCredentialPage />} />
          <Route path="/admin" element={<AdminDeployPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
