import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './BoardFreeEdit.module.css';

const BoardFReeEdit = () => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    
    // 상태 관리 (삭제할 기존 파일 아이디, 새로운 파일 목록, 모달 열림 여부)
    const [deletedExistingFiles, setDeletedExistingFiles] = useState([]);
    const [fileRows, setFileRows] = useState([{ id: Date.now(), files: [] }]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 이벤트 핸들러: 기존 첨부파일 삭제
    const handleDeleteExisting = (fileId) => {
        if (window.confirm("기존 첨부파일을 삭제하시겠습니까?")) {
            setDeletedExistingFiles([...deletedExistingFiles, fileId]);
        }
    };

    // 이벤트 핸들러: 새 첨부파일 행 추가
    const handleAddFileRow = () => {
        setFileRows([...fileRows, { id: Date.now(), files: [] }]);
    };

    // 이벤트 핸들러: 새 첨부파일 행 삭제
    const handleRemoveFileRow = (rowId) => {
        setFileRows(fileRows.filter((row) => row.id !== rowId));
    };

    // 이벤트 핸들러: 첨부파일 변경 처리 및 용량 제한 검사
    const handleFileChange = (rowId, event) => {
        const selectedFiles = Array.from(event.target.files);
        const maxFileSize = 5 * 1024 * 1024; // 5MB

        for (let file of selectedFiles) {
            if (file.size > maxFileSize) {
                alert('첨부파일 최대 용량을 넘었습니다. 다시 첨부해주세요.');
                event.target.value = '';
                return;
            }
        }

        setFileRows(
            fileRows.map((row) =>
                row.id === rowId ? { ...row, files: selectedFiles } : row
            )
        );
    };

    // 이벤트 핸들러: 폼 제출 (유효성 검사 및 모달 토글)
    const handleSubmit = (e) => {
        e.preventDefault();
        const form = formRef.current;
        
        if (!form.board_title.value.trim()) { 
            alert('제목을 입력해주세요.'); 
            return; 
        }
        if (!form.board_content.value.trim()) { 
            alert('내용을 입력해주세요.'); 
            return; 
        }

        // 새 첨부파일 여부 확인
        const hasNewFiles = fileRows.some(row => row.files.length > 0);
        // 기존 첨부파일 존재 여부 확인 (샘플 데이터 1번 기준)
        const hasExistingFiles = !deletedExistingFiles.includes(1);

        // 둘 다 없을 경우 모달 출력
        if (!hasNewFiles && !hasExistingFiles) {
            setIsModalOpen(true);
        } else {
            form.submit();
        }
    };

    // 첨부파일 없이 수정 승인
    const confirmSubmit = () => {
        setIsModalOpen(false);
        formRef.current.submit();
    };

    return (
        <div className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>자유게시판 글 수정</h2>
                </div>

                <form 
                    id="attmForm" 
                    ref={formRef}
                    action="/board/update" 
                    method="POST" 
                    encType="multipart/form-data"
                    onSubmit={handleSubmit}
                >
                    <input type="hidden" name="board_type" value="FRE" />
                    <input type="hidden" name="board_id" value="123" />

                    <div className={styles.field}>
                        <label htmlFor="board_title">
                            제목<span className={styles.req}>*</span>
                        </label>
                        <input 
                            type="text" 
                            id="board_title" 
                            name="board_title" 
                            defaultValue="청년 주거지원 정책 관련해서 질문 있습니다!" 
                            placeholder="게시글 제목을 입력해주세요" 
                            required 
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="board_content">
                            내용<span className={styles.req}>*</span>
                        </label>
                        <textarea 
                            id="board_content" 
                            name="board_content" 
                            defaultValue="안녕하세요, 이번에 주거지원 정책을 알아보려고 하는데 여러 가지 헷갈리는 부분이 있어서 질문 남깁니다.&#10;&#10;소득 분위 산정 기준이 세전인지 세후인지, 그리고 부모님과 떨어져 살아도 부모님 소득이 합산되는지 궁금합니다.&#10;혹시 최근에 신청해보신 분 계시면 답변 부탁드리겠습니다! 감사합니다."
                            placeholder="청년복지 관련 자유로운 이야기를 나누어보세요. (욕설, 비방 등은 삭제될 수 있습니다.)" 
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <div className={styles.fileHeader}>
                            <label>
                                파일 첨부 
                                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#ADB5BD', marginLeft: '6px' }}>
                                    (최대 5MB)
                                </span>
                            </label>
                        </div>

                        {/* ── 기존 첨부파일 영역 ── */}
                        <div className={styles.existingFiles} id="existingFilesArea">
                            <label style={{ fontSize: '12px', color: '#6C757D', fontWeight: 500, marginBottom: '6px', display: 'block' }}>
                                기존에 첨부된 파일
                            </label>
                            
                            {!deletedExistingFiles.includes(1) && (
                                <div className={styles.existingFileItem}>
                                    <div className={styles.existingFileName}>
                                        <svg viewBox="0 0 24 24" style={{ width: '14px', height: '14px', stroke: 'currentColor', strokeWidth: 2, fill: 'none' }}>
                                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                        </svg>
                                        주거지원_정책안내_가이드.pdf <span style={{ color: '#ADB5BD', fontSize: '11px' }}>(1.2MB)</span>
                                    </div>
                                    <button
                                        type="button"
                                        className={styles.btnRemoveExisting}
                                        onClick={() => handleDeleteExisting(1)}
                                        title="삭제"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 삭제할 기존 파일 ID 전송용 */}
                        {deletedExistingFiles.map((id) => (
                            <input key={`del-${id}`} type="hidden" name="deleteFileIds" value={id} />
                        ))}

                        {/* ── 새로운 파일 첨부 영역 ── */}
                        <div className={styles.fileHeader} style={{ marginTop: '16px' }}>
                            <label style={{ fontSize: '12px', color: '#6C757D', fontWeight: 500 }}>
                                새 파일 추가하기
                            </label>
                            <button 
                                type="button" 
                                id="addFile" 
                                className={styles.btnAddFile} 
                                onClick={handleAddFileRow}
                            >
                                + 파일 추가
                            </button>
                        </div>
                        
                        <div id="fileArea">
                            {fileRows.map((row, index) => (
                                <div key={row.id} className={styles.fileRow}>
                                    <input 
                                        type="file" 
                                        name="file" 
                                        id={`file_input_${row.id}`}
                                        className={styles.fileInputHidden} 
                                        multiple 
                                        onChange={(e) => handleFileChange(row.id, e)}
                                    />
                                    
                                    <input type="hidden" name="attm_id" value="" />
                                    <input type="hidden" name="original_name" value={row.files.map(f => f.name).join(',')} />
                                    <input type="hidden" name="rename_name" value="" />
                                    <input type="hidden" name="attm_path" value="" />
                                    <input type="hidden" name="attm_status" value="Y" />
                                    <input type="hidden" name="board_id" value="" />
                                    
                                    <div 
                                        className={styles.fileCustomBox} 
                                        onClick={() => document.getElementById(`file_input_${row.id}`).click()}
                                    >
                                        <button type="button" className={styles.btnFile}>파일 선택</button>
                                        <span className={styles.fileName} style={{ color: row.files.length > 0 ? '#1A1D23' : '#ADB5BD' }}>
                                            {row.files.length > 0 ? row.files.map(f => f.name).join(', ') : '선택된 파일 없음'}
                                        </span>
                                    </div>
                                    
                                    {index > 0 && (
                                        <button 
                                            type="button" 
                                            className={styles.btnRemoveFile} 
                                            title="삭제" 
                                            onClick={() => handleRemoveFileRow(row.id)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.btnCancel} onClick={() => navigate(-1)}>
                            취소
                        </button>
                        <button type="submit" id="submitAttm" className={styles.btnSubmit}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth={2}>
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                            수정 완료
                        </button>
                    </div>
                </form>
            </div>

            {/* 첨부파일 확인 모달 */}
            {isModalOpen && (
                <div id="modalChoice" className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <p>첨부된 파일이 하나도 없습니다.<br />이대로 게시글을 수정하시겠습니까?</p>
                        <div className={styles.modalActions}>
                            <button 
                                type="button" 
                                className={`${styles.modalBtn} ${styles.cancel}`} 
                                onClick={() => setIsModalOpen(false)}
                            >
                                취소
                            </button>
                            <button 
                                type="button" 
                                className={`${styles.modalBtn} ${styles.confirm}`} 
                                onClick={confirmSubmit}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardFReeEdit;