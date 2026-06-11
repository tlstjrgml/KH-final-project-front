import React from 'react';
import { BrowserRouter, Routes, Route, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Login from './layouts/Login';
import Signup from './layouts/Signup';
import Main from './layouts/Main';
import EditProfile from './layouts/EditProfile';
import AdminPage from './layouts/AdminPage';
import MyPage from './layouts/MyPage';

import BoardReview from './layouts/BoardReview'
import BoardReviewEdit from './layouts/BoardReviewEdit';
import BoardReviewWrite from './layouts/BoardReviewWrite';
import BoardReviewDetail from './layouts/BoardReviewDetail';
import NoticeDetail from './layouts/NoticeDetail';
import WelfareList from './layouts/WelfareList';
import WelfareDetail from './layouts/WelfareDetail';
import Persona from './layouts/Persona';
import BoardFree from './layouts/BoardFree';
import BoardFreeDetail from './layouts/BoardFreeDetail';
import BoardFreeWrite from './layouts/BoardFreeWrite';
import NoticeBoard from './layouts/NoticeBoard';
import NoticeWrite from './layouts/NoticeWrite';

const AppInner = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const isLoggedIn = localStorage.getItem('token') ? true : false;

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      window.location.replace('/');
    }
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} nickname="석희" />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route path="/boardreview" element={<BoardReview />} />
        <Route path="/boardreview/write" element={<BoardReviewWrite />} />
        <Route path="/boardreview/edit" element={<BoardReviewEdit />} />
        <Route path="/boardreview/detail" element={<BoardReviewDetail />} />
        <Route path="/welfarelist" element={<WelfareList />} />
        <Route path="/welfaredetail/:id" element={<WelfareDetail />} />
        <Route path="/persona" element={<Persona />} />
        <Route path="/boardfree" element={<BoardFree />} />
        <Route path="/boardfreedetail" element={<BoardFreeDetail />} />
        <Route path="/boardfreewrite" element={<BoardFreeWrite />} />
        <Route path="/noticeboard" element={<NoticeBoard />} />
        <Route path="/noticewrite" element={<NoticeWrite />} />
        <Route path="/notice/detail" element={<NoticeDetail />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;