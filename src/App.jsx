import React from 'react';
import { BrowserRouter, Routes, Route, useSearchParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/common/Navbar';
import Login from './layouts/Login';
import Signup from './layouts/Signup';
import Main from './layouts/Main';
import EditProfile from './layouts/EditProfile';
import MyPage from './layouts/MyPage';

import BoardReview from './layouts/BoardReview'
import BoardReviewEdit from './layouts/BoardReviewEdit';
import BoardReviewWrite from './layouts/BoardReviewWrite';
import BoardReviewDetail from './layouts/BoardReviewDetail';
import AlertDetail from './layouts/AlertDetail';
import AlertWrite from './layouts/AlertWrite';
import WelfareList from './layouts/WelfareList';
import WelfareDetail from './layouts/WelfareDetail';
import Persona from './layouts/Persona';
import BoardFree from './layouts/BoardFree';
import BoardFreeDetail from './layouts/BoardFreeDetail';
import BoardFreeWrite from './layouts/BoardFreeWrite';
import NoticeBoard from './layouts/NoticeBoard';
import NoticeWrite from './layouts/NoticeWrite';

const PrivateRoute = ({element}) => {
  const token = localStorage.getItem('token');
  if(!token){
    alert('로그인이 필요한 페이지입니다. 로그인을 해주세요');
    return <Navigate to="/login"/>
  }
  return element;
}
const AppInner=()=>{
    const [searchParams] = useSearchParams();

    const token = searchParams.get('token');
    const isLoggedIn = localStorage.getItem('token') ? true : false
    useEffect(()=>{
      
      if(token){
        localStorage.setItem('token', token);
        window.location.replace('/');
      }
    },[]);

    return(
      <>
      <Navbar isLoggedIn={isLoggedIn} nickname="석희" />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/edit-profile" element={<PrivateRoute element = {<EditProfile/>} />} />
        <Route path="/mypage" element={<PrivateRoute element={<MyPage />} />}/>

        <Route path="/boardreview" element={<BoardReview />} />
        <Route path="/boardreview/write" element={<PrivateRoute element={<BoardReviewWrite />}/>} />
        <Route path="/boardreview/edit" element={<PrivateRoute element={<BoardReviewEdit />} />}/>
        <Route path="/boardreview/detail" element={<PrivateRoute element={<BoardReviewDetail />} />}/>
        <Route path="/alert/detail" element={<AlertDetail />} />
        <Route path="/alert/write" element={<PrivateRoute element={<AlertWrite />} />}/>
        <Route path="/welfarelist" element={<WelfareList />} />
        <Route path="/welfaredetail" element={<PrivateRoute element={<WelfareDetail />} />}/>
        <Route path="/persona" element={<PrivateRoute element={<Persona />} />}/>
        <Route path="/boardfree" element={<BoardFree />} />
        <Route path="/boardfreedetail" element={<PrivateRoute element = {<BoardFreeDetail />} />}/> 
        <Route path="/boardfreewrite" element={<PrivateRoute element = {<BoardFreeWrite />} />}/>
        <Route path="/noticeboard" element={<NoticeBoard />} />
        <Route path="/noticewrite" element={<PrivateRoute element = {<NoticeWrite />} />}/>
      </Routes>
      </>

    );
  }


function App() {
  return (
    <BrowserRouter>
    {/* 나중에 provider로 묶고 navbar 하드코딩 수정,board들은 나중에id추가
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
        <Route path="/boardreview/detail" element={<BoardReviewDetail />} />
        <Route path="/alert/detail" element={<AlertDetail />} />
        <Route path="/alert/write" element={<AlertWrite />} />
        <Route path="/welfarelist" element={<WelfareList />} />
        <Route path="/welfaredetail" element={<WelfareDetail />} />
        <Route path="/persona" element={<Persona />} />
        <Route path="/boardfree" element={<BoardFree />} />
        <Route path="/boardfreedetail" element={<BoardFreeDetail />} />
        <Route path="/boardfreewrite" element={<BoardFreeWrite />} />
        <Route path="/noticeboard" element={<NoticeBoard />} />
        <Route path="/noticewrite" element={<NoticeWrite />} />
      </Routes> */}
      <AppInner/>
    </BrowserRouter>
  );       

  
}

export default App;