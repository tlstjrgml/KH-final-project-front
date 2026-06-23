import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './AdminDashboard.module.css';

function AdminDashboard() {
    const [totalUsers, setTotalUsers] = useState(0);
    const [signupData, setSignupData] = useState([]);
    const [topWelfareData, setTopWelfareData] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [totalRes, signupRes, topRes] = await Promise.all([
                fetch('http://localhost:8080/member/admin/dashboard/total-members', { headers }),
                fetch('http://localhost:8080/member/admin/dashboard/signup-trend', { headers }),
                fetch('http://localhost:8080/member/admin/dashboard/top-welfare', { headers })
            ]);

            if (totalRes.ok) setTotalUsers(await totalRes.json());
            if (signupRes.ok) setSignupData(await signupRes.json());
            if (topRes.ok) setTopWelfareData(await topRes.json());
        } catch (error) {
            console.error('데이터 로드 실패:', error);
        }
    };

    useEffect(() => { fetchDashboardData(); }, []);

    return (
        <section className={`${styles['tab-content']} ${styles['active-tab']}`}>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
                <h2 style={{ margin: 0, color: '#2c3e50', fontWeight: '800' }}>관리자 대시보드</h2>
                <div style={{
                    background: 'linear-gradient(135deg, #f0f4ff 0%, #e0eafc 100%)', // 은은한 파란색 그라데이션
                    color: '#0d6efd',
                    padding: '8px 20px',
                    borderRadius: '30px', // 알약 모양의 둥근 테두리
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px rgba(13, 110, 253, 0.1)', // 부드러운 그림자로 입체감 부여
                    border: '1px solid rgba(13, 110, 253, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    👥 총 누적 가입자 
                    <span style={{ fontSize: '1.25rem', color: '#004a9f', marginLeft: '4px' }}>{totalUsers}</span> 명
                </div>
            </div>

            {/* 2. 하단 차트 영역 */}
            <div className={styles['dashboard-grid']}>
                
                {/* 최근 7일 가입자 추이 */}
                <div className={`${styles.card} ${styles['chart-card']}`}>
                    <h3 style={{ marginBottom: '20px' }}>최근 7일 가입자 추이</h3>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={signupData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Line type="monotone" dataKey="users" name="신규 가입자" stroke="#0d6efd" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 인기 복지 카테고리 */}
                <div className={`${styles.card} ${styles['chart-card']}`}>
                    <h3>인기 복지 카테고리</h3>
                    <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                data={topWelfareData} 
                                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis 
                                    dataKey="title" 
                                    interval={0} 
                                    angle={-45} 
                                    textAnchor="end" 
                                    height={100}
                                    tick={{ fontSize: 11 }} 
                                />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8f9fa' }} />
                                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '40px' }} />
                                <Bar dataKey="views" name="조회수" fill="#198754" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="wishes" name="찜 횟수" fill="#ff4d4f" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </section>
    );
}

export default AdminDashboard;