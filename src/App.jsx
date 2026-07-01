import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
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
import BoardFreeEdit from './layouts/BoardFreeEdit';
import MyBoardList from './layouts/MyBoardList';
import MyRepliesList from './layouts/MyRepliesList';
import MyReports from './layouts/MyReports';
import MyWishList from './layouts/MyWishList';
import FindPassword from './layouts/FindPassword';
const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('로그인이 필요한 페이지입니다. 로그인을 해주세요');
    return <Navigate to="/login" />;
  }
  return element;
};

const AdminRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('로그인이 필요한 페이지입니다. 로그인을 해주세요');
    return <Navigate to="/login" />;
  }
  const isAdmin = JSON.parse(atob(token.split('.')[1])).isAdmin === 'Y';
  if (!isAdmin) {
    alert('관리자만 접근할 수 있는 페이지입니다.');
    return <Navigate to="/" />;
  }
  return element;
}

const AppInner = () => {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get('token');
  const navigate = useNavigate();

  const storedToken = localStorage.getItem('token');

  const [toastMessage, setToastMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    if (!storedToken) {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setNickname("");
      return;
    }

    try {
      const decodedToken = jwtDecode(storedToken);

      const isTokenExpired = decodedToken.exp * 1000 < Date.now();

      if (isTokenExpired) {
        console.warn("토큰이 만료되어 자동으로 로그아웃합니다.");
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setIsAdmin(false);
        setNickname("");
      } else {
        setIsLoggedIn(true);
        setIsAdmin(decodedToken.isAdmin === 'Y');
        setNickname(decodedToken.nickname || "");
      }
    } catch (error) {
      console.error("토큰 파싱 에러:", error);
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  }, [storedToken]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const eventSource = new EventSource(`/react/sse/connect?token=${storedToken}`);;
    eventSource.onmessage = (e) => {
      setToastMessage(e.data);
      setTimeout(() => {
        setToastMessage(null);
      }, 10000);
    };
    return () => {
      eventSource.close();
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (urlToken) {
      localStorage.setItem('token', urlToken);
      navigate('/', { replace: true });
    }
  }, [urlToken, navigate]);

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} nickname={nickname} />
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#333',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '8px',
          zIndex: 9999
        }}>
          {toastMessage}
        </div>
      )}
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/FindPassword' element={<FindPassword/>}/>
        <Route path="/edit-profile" element={<PrivateRoute element={<EditProfile />} />} />
        <Route path="/mypage" element={<PrivateRoute element={<MyPage />} />} />
        <Route path="/mypage/boards" element={<PrivateRoute element={<MyBoardList />} />} />
        <Route path="/mypage/replies" element={<PrivateRoute element={<MyRepliesList />} />} />
        <Route path="/admin" element={<AdminRoute element={<AdminPage />} />} />
        <Route path="/mypage/reports" element={<PrivateRoute element={<MyReports />} />} />
        <Route path="/mypage/wishes" element={<PrivateRoute element={<MyWishList />} />} />
        {/* 후기 게시판 영역 */}
        <Route path="/boardreview" element={<BoardReview />} />
        <Route path="/boardreview/write" element={<PrivateRoute element={<BoardReviewWrite />} />} />
        <Route path="/boardreview/edit/:id" element={<PrivateRoute element={<BoardReviewEdit />} />} />
        <Route path="/boardreview/detail/:id" element={<PrivateRoute element={<BoardReviewDetail />} />} />

        {/* 복지 및 페르소나 영역 */}
        <Route path="/welfarelist" element={<WelfareList />} />
        <Route path="/welfaredetail/:id" element={<WelfareDetail />} />
        <Route path="/persona" element={<PrivateRoute element={<Persona />} />} />

        {/* 자유 게시판 영역 */}
        <Route path="/boardfree" element={<BoardFree />} />
        <Route path="/boardfree/write" element={<PrivateRoute element={<BoardFreeWrite />} />} />
        <Route path="/boardfree/edit/:id" element={<PrivateRoute element={<BoardFreeEdit />} />} />
        <Route path="/boardfree/detail/:id" element={<PrivateRoute element={<BoardFreeDetail />} />} />

        {/* 공지사항 게시판 영역 */}
        <Route path="/noticeboard" element={<NoticeBoard />} />
        <Route path="/noticeboard/write" element={<NoticeBoardWrite />} />
        <Route path="/notice/write" element={<NoticeBoardWrite />} />
        <Route path="/noticeboard/edit/:id" element={<PrivateRoute element={<NoticeBoardEdit />} />} />
        <Route path="/notice/detail/:id" element={<NoticeBoardDetail />} />
        <Route path="/notice/detail/:id/:id" element={<NoticeBoardDetail />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}

export default App;