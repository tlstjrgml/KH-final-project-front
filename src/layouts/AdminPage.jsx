import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import styles from './AdminPage.module.css';

// 5개의 분할된 컴포넌트 모두 불러오기 (주석 해제됨)
import AdminDashboard from './AdminDashboard';
import AdminMember from './AdminMember';
import AdminWelfare from './AdminWelfare';
import AdminNotice from './AdminNotice';
import AdminReport from './AdminReport';

function AdminPage() {
    // 처음 접속 시 대시보드가 뜨도록 기본값 설정
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className={styles['admin-page-wrapper']}>
            <Navbar isLoggedIn={true} nickname="관리자" />
            <div className={styles.container}>
                <aside className={styles.sidebar}>
                    <ul>
                        <li className={activeTab === 'dashboard' ? styles.active : ''} onClick={() => setActiveTab('dashboard')}>대시보드</li>
                        <li className={activeTab === 'member' ? styles.active : ''} onClick={() => setActiveTab('member')}>회원관리</li>
                        <li className={activeTab === 'welfare' ? styles.active : ''} onClick={() => setActiveTab('welfare')}>복지게시판관리</li>
                        <li className={activeTab === 'notice' ? styles.active : ''} onClick={() => setActiveTab('notice')}>공지사항관리</li>
                        <li className={activeTab === 'report' ? styles.active : ''} onClick={() => setActiveTab('report')}>신고관리</li>
                    </ul>
                </aside>

                <main className={styles.content}>
                    {/* 주석 해제: 탭 클릭 시 이제 정상적으로 화면이 나옵니다 */}
                    {activeTab === 'dashboard' && <AdminDashboard />}
                    {activeTab === 'member' && <AdminMember />}
                    {activeTab === 'welfare' && <AdminWelfare />}
                    {activeTab === 'notice' && <AdminNotice />}
                    {activeTab === 'report' && <AdminReport />}
                </main>
            </div>
        </div>
    );
}

export default AdminPage;