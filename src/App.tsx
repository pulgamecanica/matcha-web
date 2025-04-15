import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@context/AuthProvider';
import { ThemeProvider } from '@context/ThemeProvider';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { MatchingPage } from '@pages/MatchingPage';
import { ProfilePage } from '@pages/ProfilePage';
import { Dashboard } from '@/pages/DashboardPage';
import { NotFoundPage } from '@pages/NotFoundPage';
import { ProtectedRoute } from '@components/ProtectedRoute';
import ThemeToggle from '@components/ThemeToggle';
import { Toaster } from 'react-hot-toast';
import { SetupProfilePage } from '@pages/SetupProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { MatchesPage } from './pages/SeeMatchPage';

function App() {
  return (
    <>
    <Toaster
      position="top-center"
      toastOptions={{
        className: `
          border
          shadow-lg
          px-4 py-3 rounded-md
          text-sm font-medium
          bg-white text-gray-800 border-gray-300
          dark:bg-gray-800 dark:text-white dark:border-gray-600
        `,
        duration: 5000,
        success: {
          className: `
            bg-green-500 text-white border-green-700
            dark:bg-green-600 dark:border-green-400 dark:text-white
          `,
        },
        error: {
          className: `
            bg-red-500 text-white border-red-700
            dark:bg-gray-600 dark:border-red-400 dark:text-white
          `,
        },
      }}
    />
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
              <Route path="/setup" element={<ProtectedRoute><SetupProfilePage /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="/match" element={<ProtectedRoute><MatchingPage/></ProtectedRoute>}/>
              <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}/>
              <Route path="/matches" element={<ProtectedRoute><MatchesPage/></ProtectedRoute>}/>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </ThemeProvider>
    </>
  );
}

export default App;
