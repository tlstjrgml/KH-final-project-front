import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NoticeEdit.module.css';

const NoticeEdit = () => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    
    // 상태 관리 (기존 파일 삭제 목록, 새 파일 행 목록, 모달 표시 여부)
    const [deletedExistingFiles, setDeletedExistingFiles] = useState([]);
    const [fileRows, setFileRows] = useState([{ id: Date.now(), files: [] }]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 이벤트 핸들러: 기존 첨부파일 삭제
    const handleDeleteExisting = (fileId) => {
        if (window.confirm("기존 첨부파일을 삭제하시겠습니까?")) {
            setDeletedExistingFiles([...deletedExistingFiles, fileId]);
        }
    };

    // 이벤트 핸들러: 새 파일 추가 행 생성
    const handleAddFileRow = () => {
        setFileRows([...fileRows, { id: Date.now(), files: [] }]);
    };

    // 이벤트 핸들러: 새 파일 행 삭제
    const handleRemoveFileRow = (rowId) => {
        setFileRows(fileRows.filter((row) => row.id !== rowId));
    };

    // 이벤트 핸들러: 파일 선택 및 용량 검사 (최대 5MB)
    const handleFileChange = (rowId, event) => {
        const selectedFiles = Array.from(event.target.files);
        const maxFileSize = 5 * 1024 * 1024; 

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

    // 이벤트 핸들러: 폼 제출 시 파일 유무 확인
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

        // 새 파일 및 기존 파일 존재 여부 검사
        const hasNewFiles = fileRows.some(row => row.files.length > 0);
        const hasExistingFiles = !deletedExistingFiles.includes(1); // 예시: 기존 파일 ID 1번 기준

        if (!hasNewFiles && !hasExistingFiles) {
            setIsModalOpen(true);
        } else {
            form.submit();
        }
    };

    // 이벤트 핸들러: 모달에서 확인 클릭 시 폼 제출
    const confirmSubmit = () => {
        setIsModalOpen(false);
        formRef.current.submit();
    };

    return (
        <main className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>공지사항 글 수정</h2>
                </div>

                {/* 폼 전송 액션 */}
                <form 
                    id="attmForm" 
                    ref={formRef}
                    action="/notice/update" 
                    method="POST" 
                    encType="multipart/form-data"
                    onSubmit={handleSubmit}
                >
                    {/* 공지사항 게시판 타입 값 및 글 번호 식별자 */}
                    <input type="hidden" name="board_type" value="NOT" />
                    <input type="hidden" name="board_id" value="999" />

                    <div className={styles.field}>
                        <label htmlFor="board_title">
                            제목<span className={styles.req}>*</span>
                        </label>
                        <input 
                            type="text" 
                            id="board_title" 
                            name="board_title" 
                            defaultValue="[필독] 청년복지 MOA 커뮤니티 이용 수칙 안내" 
                            placeholder="공지사항 제목을 입력해주세요" 
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
                            placeholder="공지사항 내용을 상세히 입력해주세요." 
                            required
                            defaultValue={`안녕하세요. 청년복지 MOA 관리자입니다.\n\n모두가 쾌적하고 유익하게 커뮤니티를 이용할 수 있도록, 아래의 이용 수칙을 반드시 숙지해 주시기 바랍니다.\n\n1. 존중과 배려\n타인을 비방하거나 모욕적인 언행, 욕설 등은 엄격히 금지됩니다. 서로 존중하는 문화를 만들어갑시다.\n\n2. 허위 사실 유포 금지\n확인되지 않은 정책이나 지원금 정보 등 허위 사실을 유포하여 혼란을 초래하는 행위는 제재 대상입니다.\n\n3. 상업적 광고 및 홍보 금지\n게시판 목적과 맞지 않는 상업적 광고, 불법 사이트 링크 공유 등은 사전 경고 없이 삭제될 수 있습니다.\n\n위 수칙을 위반할 경우, 서비스 이용이 제한될 수 있음을 안내해 드립니다.\n감사합니다.`}
                        />
                    </div>

                    <div className={styles.field}>
                        <div className={styles.fileHeader}>
                            <label>
                                파일 첨부 
                                <span style={{ fontSize: '13px', fontWeight: 'normal', color: '#ADB5BD', marginLeft: '6px' }}>
                                    (최대 5MB)
                                </span>
                            </label>
                        </div>

                        {/* 1) 기존 첨부파일 노출 */}
                        <div className={styles.existingFiles} id="existingFilesArea">
                            <label style={{ fontSize: '13px', color: '#6C757D', fontWeight: 500, marginBottom: '8px', display: 'block' }}>
                                기존에 첨부된 파일
                            </label>
                            
                            {!deletedExistingFiles.includes(1) && (
                                <div className={styles.existingFileItem} id="existing-file-1">
                                    <div className={styles.existingFileName}>
                                        <svg viewBox="0 0 24 24" style={{ width: '16px', height: '16px', stroke: 'currentColor', strokeWidth: 2, fill: 'none' }}>
                                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                        </svg>
                                        커뮤니티_이용수칙_가이드라인.pdf <span style={{ color: '#ADB5BD', fontSize: '12px' }}>(342KB)</span>
                                    </div>
                                    {/* 삭제 버튼 클릭 시 배열에 ID 추가 */}
                                    <button 
                                        type="button" 
                                        className={styles.btnRemoveExisting} 
                                        onClick={() => handleDeleteExisting(1)} 
                                        title="삭제"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 삭제할 기존 파일들의 attm_id를 담을 컨테이너 */}
                        <div id="deletedFilesContainer">
                            {deletedExistingFiles.map((id) => (
                                <input key={`del-${id}`} type="hidden" name="deleteFileIds" value={id} />
                            ))}
                        </div>

                        {/* 2) 새로운 파일 첨부 추가 */}
                        <div className={styles.fileHeader} style={{ marginTop: '20px' }}>
                            <label style={{ fontSize: '13px', color: '#6C757D', fontWeight: 500 }}>새 파일 추가하기</label>
                            <button type="button" id="addFile" className={styles.btnAddFile} onClick={handleAddFileRow}>
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
                                    {/* ERD 속성 매핑 hidden 태그들 */}
                                    <input type="hidden" name="attm_id" value="" />
                                    <input type="hidden" name="original_name" className={styles.originalNameHidden} value={row.files.map(f => f.name).join(',')} />
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
                                    
                                    {/* 삭제 버튼은 추가된 행에만 표시 (또는 로직에 맞게 조정 가능) */}
                                    <button 
                                        type="button" 
                                        className={styles.btnRemoveFile} 
                                        style={{ display: index === 0 && fileRows.length === 1 && row.files.length === 0 ? 'none' : 'flex' }}
                                        title="삭제" 
                                        onClick={() => handleRemoveFileRow(row.id)}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
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

            {/* 첨부파일 없음 모달 */}
            {isModalOpen && (
                <div id="modalChoice" className={styles.modalOverlay} style={{ display: 'flex' }}>
                    <div className={styles.modalContent}>
                        <p>첨부된 파일이 하나도 없습니다.<br />이대로 공지사항을 수정하시겠습니까?</p>
                        <div className={styles.modalActions}>
                            <button 
                                type="button" 
                                className={`${styles.modalBtn} ${styles.cancel}`} 
                                id="closeModal" 
                                onClick={() => setIsModalOpen(false)}
                            >
                                취소
                            </button>
                            <button 
                                type="button" 
                                className={`${styles.modalBtn} ${styles.confirm}`} 
                                id="moveBoard" 
                                onClick={confirmSubmit}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default NoticeEdit;
