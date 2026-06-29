import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminWelfare.module.css'; // 나중에 일괄 세팅할 CSS

function AdminWelfare() {
    const navigate = useNavigate();


    const[loading, setLoading] = useState(false);
    const[message, setMessage] = useState('');
    const[isSuccess, setIsSuccess] = useState(null);

    const handleRefresh = async () => {
    setLoading(true);
    setMessage('');
    
    const token = localStorage.getItem('token');
    
    try {
        const res = await fetch('/react/admin/welfare/refresh', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            setIsSuccess(true);
            setMessage('갱신 완료!');
        } else {
            setIsSuccess(false);
            setMessage('갱신 실패: 서버 오류');
        }
    } catch (e) {
        setIsSuccess(false);
        setMessage('갱신 중 오류 발생');
    } finally {
        setLoading(false);
    }
};

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

            <div className={styles.card} style={{ textAlign: 'center', padding: '70px 20px' }}>
                <h3>공공데이터 수동 갱신</h3>
                <p>매일 자정 자동 갱신되지만, 즉시 갱신이 필요할 때 사용하세요.</p>
                <button className={styles['primary-btn']} onClick={handleRefresh} disabled={loading}>
                    {loading ? '갱신 중...' : '지금 갱신하기'}
                </button>
                {message && (
                    <p style={{ color: isSuccess ? 'blue' : 'red', marginTop: '15px' }}>
                        {message}
                    </p>
                )}
            </div>
        </section>
    );
}

export default AdminWelfare;