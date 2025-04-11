import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@context/AuthProvider';
import { ThemeProvider } from '@context/ThemeProvider';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { MatchingPage } from '@pages/MatchingPage';
import { ProfilePage } from '@pages/ProfilePage';
import { Dashboard } from '@pages/Dashboard';
import { NotFoundPage } from '@pages/NotFoundPage';
import { ProtectedRoute } from '@components/ProtectedRoute';
import ThemeToggle from '@components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle/>
        </div>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
              <Route path="/match" element={<ProtectedRoute><MatchingPage/></ProtectedRoute>}/>
              <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </ThemeProvider>

  );
}

export default App;
