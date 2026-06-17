import React from 'react';
import { BrowserRouter, Routes, Route, useSearchParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Login from './layouts/Login';
import Signup from './layouts/Signup';
import Main from './layouts/Main';
import EditProfile from './layouts/EditProfile';
import AdminPage from './layouts/AdminPage';
import MyPage from './layouts/MyPage';
import BoardReview from './layouts/BoardReview';
import BoardReviewEdit from './layouts/BoardReviewEdit';
import BoardReviewWrite from './layouts/BoardReviewWrite';
import BoardReviewDetail from './layouts/BoardReviewDetail';
import WelfareList from './layouts/WelfareList';
import WelfareDetail from './layouts/WelfareDetail';
import Persona from './layouts/Persona';
import BoardFree from './layouts/BoardFree';
import BoardFreeDetail from './layouts/BoardFreeDetail';
import BoardFreeWrite from './layouts/BoardFreeWrite';
import NoticeBoard from './layouts/NoticeBoard';
import NoticeBoardWrite from './layouts/NoticeBoardWrite';
import NoticeBoardEdit from './layouts/NoticeBoardEdit';
import NoticeBoardDetail from './layouts/NoticeBoardDetail';




const PrivateRoute = ({element}) => {
  const token = localStorage.getItem('token');
  if(!token){
    alert('로그인이 필요한 페이지입니다. 로그인을 해주세요');
    return <Navigate to="/login"/>;
  }
  return element;
}

const AppInner = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const isLoggedIn = localStorage.getItem('token') ? true : false;
  const isAdmin = isLoggedIn ? JSON.parse(atob(localStorage.getItem('token').split('.')[1])).isAdmin === 'Y' : false;
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      window.location.replace('/');
    }
  }, []);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} nickname="석희" />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit-profile" element={<PrivateRoute element={<EditProfile />} />} />
        <Route path="/mypage" element={<PrivateRoute element={<MyPage />} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/boardreview" element={<BoardReview />} />
     
        <Route path="/boardreview/write" element={<PrivateRoute element={<BoardReviewWrite />} />} />
        <Route path="/boardreview/edit" element={<PrivateRoute element={<BoardReviewEdit />} />} />
        <Route path="/boardreview/detail" element={<BoardReviewDetail />} />
        <Route path="/welfarelist" element={<WelfareList />} />
        <Route path="/welfaredetail/:id" element={<WelfareDetail />} />
        <Route path="/persona" element={<PrivateRoute element={<Persona />} />} />
        <Route path="/boardfree" element={<BoardFree />} />
        <Route path="/boardfree/detail" element={<BoardFreeDetail />} />
        <Route path="/boardfree/write" element={<PrivateRoute element={<BoardFreeWrite />} />} />
        <Route path="/noticeboard" element={<NoticeBoard />} />
        <Route path="/notice/write" element={<PrivateRoute element={<NoticeBoardWrite />} />} />
        <Route path="/notice/detail" element={<NoticeBoardDetail />} />
        <Route path="/notice/eidt" element={<PrivateRoute element={<NoticeBoardEdit />} />} />
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