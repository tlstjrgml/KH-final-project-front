const PrivateRoute = ({element}) => {
  const token = localStorage.getItem('token');
  if(!token){
    alert('로그인이 필요한 페이지입니다. 로그인을 해주세요');
    return <Navigate to="/login"/>
  }
  return element;
}

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
        <Route path="/edit-profile" element={<PrivateRoute element={<EditProfile />} />} />
        <Route path="/mypage" element={<PrivateRoute element={<MyPage />} />} />
        <Route path="/admin" element={<AdminPage />} />

        <Route path="/boardreview" element={<BoardReview />} />
        <Route path="/boardreview/write" element={<PrivateRoute element={<BoardReviewWrite />} />} />
        <Route path="/boardreview/edit" element={<PrivateRoute element={<BoardReviewEdit />} />} />
        <Route path="/boardreview/detail" element={<PrivateRoute element={<BoardReviewDetail />} />} />
        <Route path="/welfarelist" element={<WelfareList />} />
        <Route path="/welfaredetail/:id" element={<WelfareDetail />} />
        <Route path="/persona" element={<PrivateRoute element={<Persona />} />} />
        <Route path="/boardfree" element={<BoardFree />} />
        <Route path="/boardfreedetail" element={<PrivateRoute element={<BoardFreeDetail />} />} />
        <Route path="/boardfreewrite" element={<PrivateRoute element={<BoardFreeWrite />} />} />
        <Route path="/noticeboard" element={<NoticeBoard />} />
        <Route path="/noticewrite" element={<PrivateRoute element={<NoticeWrite />} />} />
        <Route path="/notice/detail" element={<NoticeDetail />} />
      </Routes>
    </>
  );
}