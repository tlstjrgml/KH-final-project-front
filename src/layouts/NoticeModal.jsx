import React, { useState, useEffect, useRef } from 'react';
import styles from './NoticeModal.module.css'; 

function NoticeModal({ notice, onClose, onSave, isReadOnly = false }) {
    const [boardTitle, setBoardTitle] = useState('');
    const [boardContent, setBoardContent] = useState('');
    const [files, setFiles] = useState([]); 
    const [existingFiles, setExistingFiles] = useState([]); 
    const [deleteFileIds, setDeleteFileIds] = useState([]); 

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (notice) {
            setBoardTitle(notice.boardTitle);
            setBoardContent(notice.boardContent || '');
            setFiles([]);
            setDeleteFileIds([]); 
            setExistingFiles(notice.attachments || []);
        } else {
            setBoardTitle('');
            setBoardContent('');
            setFiles([]);
            setExistingFiles([]);
            setDeleteFileIds([]);
        }
    }, [notice]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveFile = (indexToRemove) => {
        setFiles((prevFiles) => prevFiles.filter((_, idx) => idx !== indexToRemove));
    };

    const handleRemoveExistingFile = (attmIdToRemove) => {
        setExistingFiles((prevFiles) => 
            prevFiles.filter(file => file.attmId !== attmIdToRemove)
        );
        setDeleteFileIds((prevIds) => [...prevIds, attmIdToRemove]);
    };

    // 💡 상세 HTTP 상태 코드와 에러 원인을 화면에 띄워주는 다운로드 로직
    const handleFileDownload = async (attmId, fileName) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        const downloadUrl = `http://localhost:8080/board/download/${attmId}`;
        console.log("다운로드 시도 URL:", downloadUrl);

        try {
            const response = await fetch(downloadUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`[HTTP ${response.status}] 서버 응답 실패\n사유: ${errorText || '원인 불명'}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Detailed Download Error:", error);
            alert(`파일 다운로드 에러 발생:\n${error.message}`);
        }
    };

    const handleSubmit = async () => {
        if (!boardTitle.trim() || !boardContent.trim()) { 
            alert("입력값을 확인해주세요."); 
            return; 
        }

        const token = localStorage.getItem('token');
        if (!token) { 
            alert("로그인이 필요합니다."); 
            return; 
        }

        const isEditMode = notice && notice.boardId;
        const formData = new FormData();

        if (isEditMode) {
            formData.append("boardId", notice.boardId);
        }

        formData.append("boardTitle", boardTitle);
        formData.append("boardContent", boardContent);
        formData.append("boardType", "NOT"); 

        if (files.length > 0) {
            const fileKey = isEditMode ? 'newFiles' : 'files';
            files.forEach(file => {
                formData.append(fileKey, file);
            });
        }

        if (deleteFileIds.length > 0) {
            deleteFileIds.forEach(id => {
                formData.append("deleteFileIds", id);
            });
        }
        
        const url = isEditMode 
            ? `http://localhost:8080/board/${notice.boardId}` 
            : `http://localhost:8080/board/write`; 
            
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method, 
                headers: {
                    'Authorization': `Bearer ${token}` 
                },
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || (isEditMode ? "서버 수정 실패" : "서버 등록 실패"));
            }

            alert(isEditMode ? "수정이 완료되었습니다." : "새 공지사항이 등록되었습니다.");
            onSave(); 

        } catch (error) {
            console.error('Submit Error:', error);
            alert(`에러 발생: ${error.message}`);
        }
    };

    return (
        <div className={styles['modal-overlay']}>
            <div className={styles.modal} style={{ width: '600px' }}> 
                <div className={styles['modal-header']}>
                    <h3>{isReadOnly ? '공지사항 상세' : (notice ? '공지사항 수정' : '새 공지사항 작성')}</h3>
                    <button className={styles['close-btn']} onClick={onClose}>✕</button>
                </div>

                <div className={styles['modal-body']} style={{ maxHeight: '55vh', overflowY: 'auto', paddingRight: '8px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#343A40' }}>제목</label>
                        <input
                            type="text"
                            value={boardTitle}
                            onChange={(e) => setBoardTitle(e.target.value)}
                            className={styles['search-input']}
                            style={{ width: '100%', boxSizing: 'border-box', backgroundColor: isReadOnly ? '#e9ecef' : '#fff' }}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#343A40' }}>내용</label>
                        <textarea
                            value={boardContent}
                            onChange={(e) => setBoardContent(e.target.value)}
                            style={{
                                width: '100%',
                                height: '200px',
                                padding: '12px',
                                borderRadius: '6px',
                                border: '1px solid #CED4DA',
                                resize: 'none',
                                boxSizing: 'border-box',
                                fontFamily: 'inherit',
                                backgroundColor: isReadOnly ? '#e9ecef' : '#fff'
                            }}
                            disabled={isReadOnly}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#343A40' }}>
                            첨부파일
                        </label>
                        
                        {!isReadOnly && (
                            <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                style={{ marginBottom: '12px', display: 'block' }}
                            />
                        )}
                        
                        {!isReadOnly && files.length > 0 && (
                            <div style={{ border: '1px solid #E9ECEF', borderRadius: '6px', padding: '10px', backgroundColor: '#F8F9FA', marginBottom: '12px' }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold', color: '#495057' }}>새로 추가된 파일 ({files.length}개):</p>
                                {files.map((file, idx) => (
                                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', fontSize: '14px' }}>
                                        <span style={{ color: '#495057', wordBreak: 'break-all' }}>{file.name}</span>
                                        <button type="button" onClick={() => handleRemoveFile(idx)} style={{ border: 'none', background: 'none', color: '#DC3545', cursor: 'pointer', fontWeight: 'bold', marginLeft: '10px' }}>삭제</button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {existingFiles.length > 0 ? (
                            <div style={{ border: '1px solid #CED4DA', borderRadius: '6px', padding: '10px', backgroundColor: '#FFF' }}>
                                <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: 'bold', color: '#495057' }}>등록된 첨부파일 ({existingFiles.length}개):</p>
                                {existingFiles.map((file, idx) => {
                                    const fileId = file.attmId;
                                    const fileName = file.originalName || "첨부파일";

                                    return (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '14px' }}>
                                            <span 
                                                onClick={() => handleFileDownload(fileId, fileName)}
                                                style={{ color: '#007BFF', textDecoration: 'underline', cursor: 'pointer', fontWeight: '500', wordBreak: 'break-all', marginRight: '10px' }}
                                            >
                                                📎 {fileName}
                                            </span>
                                            {!isReadOnly && (
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveExistingFile(fileId)} 
                                                    style={{ border: 'none', background: 'none', color: '#DC3545', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    삭제
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            isReadOnly && <div style={{ color: '#868E96', fontSize: '14px' }}>첨부된 파일이 없습니다.</div>
                        )}
                    </div>
                </div>

                <div className={styles['modal-footer']}>
                    {isReadOnly ? (
                        <button className={styles['primary-btn']} onClick={onClose}>닫기</button>
                    ) : (
                        <>
                            <button className={styles['outline-btn']} onClick={onClose}>취소</button>
                            <button className={styles['primary-btn']} onClick={handleSubmit}>
                                {notice ? '수정 완료' : '등록 완료'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NoticeModal;