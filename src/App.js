import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import PostsList from './pages/PostsList';
import PostPage from './pages/PostPage'; // 
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import TestApi from './TestApi'; // optional health check

export default function App() {
  const { user } = useAuth(); 

  return (
    <BrowserRouter>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* public: list of all posts + total count */}
          <Route path="/posts" element={<PostsList />} />

          {/* NEW: single post view */}
          <Route path="/posts/:id" element={<PostPage />} />

          {/* requires login (page itself will show "not signed in" if needed) */}
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />

          {/* tools */}
          <Route path="/health" element={<TestApi />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
