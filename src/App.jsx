import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Login from './layouts/Login';
import Signup from './layouts/Signup';
import Main from './layouts/Main';
import EditProfile from './layouts/EditProfile';
import MyPage from './layouts/MyPage';
import WelfareList from './layouts/WelfareList';
import WelfareDetail from './layouts/WelfareDetail';
import Persona from './layouts/Persona';

function App() {
  return (
    <BrowserRouter>
    {/* 나중에 provider로 묶고 navbar 하드코딩 수정 */}
      <Navbar isLoggedIn={false} nickname="석희" />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/welfarelist" element={<WelfareList />} />
        <Route path="/welfaredetail" element={<WelfareDetail />} />
        <Route path="/persona" element={<Persona />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;