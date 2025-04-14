import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from '@/context/UserProvider'
import { ThemeProvider } from '@context/ThemeProvider';
import { LoginPage } from '@pages/LoginPage';
import { RegisterPage } from '@pages/RegisterPage';
import { MatchingPage } from '@pages/MatchingPage';
import { ProfilePage } from '@pages/ProfilePage';
import { Dashboard } from '@pages/Dashboard';
import { NotFoundPage } from '@pages/NotFoundPage';
import ThemeToggle from '@components/ThemeToggle';
import { Toaster } from 'react-hot-toast';
import { SetupProfilePage } from '@pages/SetupProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { AuthProvider } from './context/AuthProvider';

function App() {
  return (
    <>
    <Toaster
      position="top-right"
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
    <AuthProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="fixed bottom-4 right-4 z-50">
          <ThemeToggle/>
        </div>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              {/* <Route path="/register" element={<RegisterPage />} /> */}
              <Route path="/" element={<Dashboard/>} />
              {/* <Route path="/setup" element={<SetupProfilePage />} /> */}
              {/* <Route path="/profile/edit" element={<EditProfilePage />} /> */}
              <Route path="/match" element={<MatchingPage/>}/>
              <Route path="/profile" element={<ProfilePage/>}/>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </div>
      </AuthProvider>
    </ThemeProvider>
    </>
  );
}

export default App;
