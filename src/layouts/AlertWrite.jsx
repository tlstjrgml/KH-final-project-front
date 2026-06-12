import React, { useState, useRef } from 'react';
import styles from './AlertWrite.module.css';

const AlertWrite = () => {
    // 첨부파일 관리 상태
    const [fileList, setFileList] = useState([{ id: Date.now() }]);
    const [showModal, setShowModal] = useState(false);
    const fileInputRefs = useRef({});

    // 파일 추가
    const addFileRow = () => {
        setFileList([...fileList, { id: Date.now() }]);
    };

    // 파일 삭제
    const removeFileRow = (id) => {
        setFileList(fileList.filter(file => file.id !== id));
    };

    // 파일 선택창 열기
    const triggerFileInput = (id) => {
        fileInputRefs.current[id].click();
    };

    // 파일 선택 변경 핸들러
    const handleFileChange = (e, id) => {
        const files = e.target.files;
        const nameDisplay = document.getElementById(`name-${id}`);

        if (files.length > 0) {
            nameDisplay.textContent = Array.from(files).map(f => f.name).join(', ');
            nameDisplay.style.color = '#1A1D23';
        } else {
            nameDisplay.textContent = '선택된 파일 없음';
            nameDisplay.style.color = '#ADB5BD';
        }
    };

    return (
        <>
           

            <main className={styles.page}>
                <div className={styles.writeCard}>
                    <div className={styles.writeHeader}>
                        <h2 className={styles.writeTitle}>공지사항 글 작성</h2>
                    </div>

                    <form id="attmForm" action="/notice/write" method="POST" encType="multipart/form-data">
                        <input type="hidden" name="board_type" value="NOT" />

                        <div className={styles.field}>
                            <label htmlFor="board_title">제목<span className={styles.req}>*</span></label>
                            <input type="text" id="board_title" name="board_title" placeholder="공지사항 제목을 입력해주세요" required />
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="board_content">내용<span className={styles.req}>*</span></label>
                            <textarea id="board_content" name="board_content" placeholder="공지사항 내용을 상세히 입력해주세요." required></textarea>
                        </div>

                        <div className={styles.field}>
                            <div className={styles.fileHeader}>
                                <label>파일 첨부 <span style={{ fontSize: '12px', color: '#ADB5BD' }}>(최대 5MB)</span></label>
                                <button type="button" className={styles.btnAddFile} onClick={addFileRow}>+ 파일 추가</button>
                            </div>

                            <div id="fileArea">
                                {fileList.map((file, index) => (
                                    <div className={styles.fileRow} key={file.id}>
                                        <input
                                            type="file"
                                            name="file"
                                            className={styles.fileInputHidden}
                                            ref={el => fileInputRefs.current[file.id] = el}
                                            onChange={(e) => handleFileChange(e, file.id)}
                                        />
                                        <div className={styles.fileCustomBox} onClick={() => triggerFileInput(file.id)}>
                                            <button type="button" className={styles.btnFile}>파일 선택</button>
                                            <span className={styles.fileName} id={`name-${file.id}`}>선택된 파일 없음</span>
                                        </div>
                                        {index > 0 && (
                                            <button type="button" className={styles.btnRemoveFile} onClick={() => removeFileRow(file.id)}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <button type="button" className={styles.btnCancel} onClick={() => window.history.back()}>취소</button>
                            <button type="button" className={styles.btnSubmit} onClick={() => setShowModal(true)}>
                               
                                공지 등록
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* 모달 */}
            {showModal && (
                <div className={styles.modalOverlay} style={{ display: 'flex' }}>
                    <div className={styles.modalContent}>
                        <p>첨부파일이 하나도 첨부되지 않았습니다.<br />이대로 공지사항을 등록하시겠습니까?</p>
                        <div className={styles.modalActions}>
                            <button type="button" className={`${styles.modalBtn} ${styles.cancel}`} onClick={() => setShowModal(false)}>취소</button>
                            <button type="button" className={`${styles.modalBtn} ${styles.confirm}`} onClick={() => document.getElementById('attmForm').submit()}>확인</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AlertWrite;