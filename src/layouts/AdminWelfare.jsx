import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminWelfare.module.css'; // 나중에 일괄 세팅할 CSS

function AdminWelfare() {
    const navigate = useNavigate();

    return (
        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
            <h2>복지게시판관리</h2>
            <div className={styles.card} style={{ textAlign: 'center', padding: '70px 20px' }}>
                <h3 style={{ marginBottom: '15px', color: '#333', fontSize: '1.2rem' }}>복지 서비스 관리 안내</h3>
                <p style={{ marginBottom: '30px', color: '#6C757D', lineHeight: '1.6' }}>
                    복지 서비스 신규 등록 및 기존 게시글의 수정/삭제는<br />
                    실제 서비스되는 <strong>복지 게시판 페이지</strong>에서 관리자 권한으로 직접 수행하실 수 있습니다.
                </p>
                <button className={styles['primary-btn']} onClick={() => navigate('/welfarelist')}>
                    메인 복지 게시판으로 이동하기 ➔
                </button>
            </div>
        </section>
    );
}

export default AdminWelfare;