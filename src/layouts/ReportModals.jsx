import React, { useState } from 'react';
import styles from './ReportModals.module.css'; // 나중에 일괄 세팅할 CSS

function ReportModals({ report, onClose, onComplete }) {
    // step: 'detail' (상세 모달) 또는 'process' (처리 모달)
    const [step, setStep] = useState('detail');

    // 처리 폼 상태
    const [processResult, setProcessResult] = useState('');
    const [processReason, setProcessReason] = useState('');

    if (!report) return null;

    // 저장 버튼 클릭 시
    const handleSave = () => {
        if (!processResult) {
            alert("처리결과를 선택하세요.");
            return;
        }
        if (!processReason.trim()) {
            alert("처리사유를 입력하세요.");
            return;
        }
        
        // DB STATUS 컬럼에 맞게 영어 코드로 변환 (기존 로직 유지)
        const statusCode = processResult === '처리완료' ? 'DONE' : 'REJECT';
        onComplete(report.no, statusCode, processReason);
    };

    return (
        <div className={styles['modal-overlay']} style={{ display: 'flex' }}>
            <div className={styles.modal}>

                {/* 1. 신고 상세정보 모달 */}
                {step === 'detail' && (
                    <>
                        <div className={styles['modal-header']}>
                            <h3>신고 상세정보</h3>
                            <button className={styles['close-btn']} onClick={onClose}>✕</button>
                        </div>
                        <div className={styles['modal-body']}>
                            <div className={styles['info-row']}>
                                <span className={styles.label}>신고번호</span>
                                <span className={styles.value}>{report.no}</span>
                            </div>
                            <div className={styles['info-row']}>
                                <span className={styles.label}>신고자</span>
                                <span className={styles.value}>{report.reporter}</span>
                            </div>
                            <div className={styles['info-row']}>
                                <span className={styles.label}>신고대상</span>
                                <span className={styles.value}>{report.target}</span>
                            </div>
                            <div className={styles['info-row']}>
                                <span className={styles.label}>신고사유</span>
                                <span className={styles.value}>{report.reason}</span>
                            </div>
                            <div className={`${styles['info-row']} ${styles['align-top']}`}>
                                <span className={styles.label}>신고내용</span>
                                <div className={`${styles.value} ${styles['reported-box']}`}>{report.content}</div>
                            </div>
                        </div>
                        <div className={styles['modal-footer']}>
                            <button className={styles['outline-btn']} onClick={onClose}>닫기</button>
                            <button className={styles['primary-btn']} onClick={() => setStep('process')}>신고처리</button>
                        </div>
                    </>
                )}

                {/* 2. 신고 처리 모달 */}
                {step === 'process' && (
                    <>
                        <div className={styles['modal-header']}>
                            <h3>신고 처리</h3>
                            <button className={styles['close-btn']} onClick={onClose}>✕</button>
                        </div>
                        <div className={styles['modal-body']}>
                            <div className={styles['process-section']}>
                                <strong className={styles['process-label']}>처리 결과</strong>
                                <div className={styles['radio-group']}>
                                    <label>
                                        <input
                                            type="radio" name="result" value="처리완료"
                                            checked={processResult === '처리완료'}
                                            onChange={(e) => setProcessResult(e.target.value)}
                                        /> 처리완료
                                    </label>
                                    <label>
                                        <input
                                            type="radio" name="result" value="거절"
                                            checked={processResult === '거절'}
                                            onChange={(e) => setProcessResult(e.target.value)}
                                        /> 거절
                                    </label>
                                </div>
                            </div>
                            <div className={styles['process-section']}>
                                <strong className={styles['process-label']}>처리 사유</strong>
                                <textarea
                                    value={processReason}
                                    onChange={(e) => setProcessReason(e.target.value)}
                                    placeholder="처리 사유를 입력하세요."
                                />
                            </div>
                        </div>
                        <div className={styles['modal-footer']}>
                            {/* 이전 단계(상세화면)로 돌아가기 또는 아예 모달 닫기 */}
                            <button className={styles['outline-btn']} onClick={() => setStep('detail')}>이전</button>
                            <button className={styles['primary-btn']} onClick={handleSave}>저장</button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

export default ReportModals;