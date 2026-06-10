import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Login from './layouts/Login';
import Signup from './layouts/Signup';
import Main from './layouts/Main';
import EditProfile from './layouts/EditProfile';
import MyPage from './layouts/MyPage';
import BoardReview from './layouts/BoardReview'
import BoardReviewEdit from './layouts/BoardReviewEdit';
import BoardReviewWrite from './layouts/BoardReviewWrite';
import AlertDetail from './layouts/AlertDetail';
import AlertWrite from './layouts/AlertWrite';

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
        <Route path="/boardreview" element={<BoardReview />} />
        <Route path="/boardreview/write" element={<BoardReviewWrite />} />
        <Route path="/boardreview/edit" element={<BoardReviewEdit />} />
        <Route path="/alert/detail" element={<AlertDetail />} />
        <Route path="/alert/write" element={<AlertWrite />} />
      </Routes>
    </BrowserRouter>
  );
  
  
}

export default App;