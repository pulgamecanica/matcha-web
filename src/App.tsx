import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './component/ProtectedRoute';
import { NotFoundPage } from './pages/NotFoundPage';
import { MatchingPage } from './pages/MatchingPage';
import { ProfilPage } from './pages/ProfilPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* wrap here to check if login */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />}/>
          {/* Add other routes here */}
          <Route path="/match" element={<ProtectedRoute><MatchingPage/></ProtectedRoute>}/>
          <Route path="/profil" element={<ProtectedRoute><ProfilPage/></ProtectedRoute>}/>
         
          {/* Last for not found route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
