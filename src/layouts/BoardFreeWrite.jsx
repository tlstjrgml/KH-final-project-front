import React, { useState, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import styles from './BoardFreeWrite.module.css';

const BoardFreeWrite = () => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [fileRows, setFileRows] = useState([{ id: Date.now(), files: [] }]);


    const handleAddFileRow = () => {
        setFileRows([...fileRows, { id: Date.now(), files: [] }]);
    };


    
    const handleRemoveFileRow = (rowId) => {
        setFileRows(fileRows.filter((row) => row.id !== rowId));
    };


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

    const executeSubmit = async () => {
        try {
            const payload = {
                boardTitle: title,
                boardContent: content,
                boardType: "FRE"
            };

            const response = await fetch('http://localhost:8080/boardfree/write', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('게시글이 성공적으로 등록되었습니다.');
                navigate('/boardfree'); 
            } else {
                alert('게시글 등록에 실패했습니다. 서버 상태나 권한을 확인해주세요.');
            }
        } catch (error) {
            console.error('글 등록 중 서버 통신 에러:', error);
            alert('서버와의 통신에 실패했습니다.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!title.trim()) { 
            alert('제목을 입력해주세요.'); 
            return; 
        }
        if (!content.trim()) { 

            alert('내용을 입력해주세요.'); 
            return; 
        }

        const hasFiles = fileRows.some(row => row.files.length > 0);

        if (!hasFiles) {
            setIsModalOpen(true);
        } else {
            executeSubmit(); 
        }
    };

    const confirmSubmit = () => {
        setIsModalOpen(false);
        executeSubmit();

    };

    return (
        <div className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>자유게시판 글 작성</h2>
                </div>

                <form ref={formRef} onSubmit={handleSubmit}>

                    <div className={styles.field}>
                        <label htmlFor="board_title">
                            제목<span className={styles.req}>*</span>
                        </label>
                        <input 
                            type="text" 
                            id="board_title" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="게시글 제목을 입력해주세요" 

                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="board_content">
                            내용<span className={styles.req}>*</span>
                        </label>
                        <textarea 
                            id="board_content" 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="청년복지 관련 자유로운 이야기를 나누어보세요. (욕설, 비방 등은 삭제될 수 있습니다.)" 


                        />
                    </div>

                    <div className={styles.field}>
                        <div className={styles.fileHeader}>
                            <label>
                                파일 첨부 
                                <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#ADB5BD', marginLeft: '6px' }}>
                                    (최대 5MB, 현재 백엔드 버전에서는 첨부파일이 서버에 저장되지 않습니다.)

                                </span>
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
                        <button type="submit" className={styles.btnSubmit}>

                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth={2}>
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                            </svg>
                            글 등록하기
                        </button>
                    </div>
                </form>
            </div>

            {isModalOpen && (
                <div id="modalChoice" className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <p>첨부파일이 하나도 첨부되지 않았습니다.<br />이대로 게시글을 등록하시겠습니까?</p>
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

export default BoardFreeWrite;