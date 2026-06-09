import React from 'react';
import Navbar from './components/common/Navbar';
import Login from './layouts/Login';
import Signup from './layouts/Signup';
import ExtraInfoModal from './layouts/ExtraInfoModal';
import Main from './layouts/Main';
import EditProfile from './layouts/EditProfile';
import BoardFree from './layouts/BoardFree';
import BoardFreeDetail from './layouts/BoardFreeDetail';

function App() {
  return (
    <>
      {/* <Navbar isLoggedIn={false} nickname="석희" />
      <Login /> 
      <Signup />
      <ExtraInfoModal
        isOpen={true}
        onClose={() => console.log('닫기')}
        onSave={() => console.log('저장')}
      />
      <Main />  */}
      {/* <EditProfile/> */}
      {/* <BoardFree/> */}
      <BoardFreeDetail/>
    </>
  )
}

export default App