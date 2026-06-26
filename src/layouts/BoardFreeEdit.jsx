import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BoardFreeWrite.module.css';  

const BoardFreeEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    const [existingFiles, setExistingFiles] = useState([]);
    const [deletedFileIds, setDeletedFileIds] = useState([]);
    
    const [fileRows, setFileRows] = useState([{ id: Date.now(), files: [] }]);

    useEffect(() => {
        const fetchBoardDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/react/board/${id}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                
                if (!res.ok) throw new Error('게시글 조회 실패');
                const data = await res.json();

                if (!data.isOwner) {
                    alert('본인이 작성한 게시글만 수정할 수 있습니다.');
                    navigate(`/boardfree/detail/${id}`);
                    return;
                }

                setTitle(data.boardTitle);
                setContent(data.boardContent);

                if (data.attachments) {
                    setExistingFiles(data.attachments.map(f => ({
                        id: f.attmId || f.fileId,
                        name: f.originalName || f.originName,
                        size: f.fileSize ? `${(f.fileSize / 1024 / 1024).toFixed(1)}MB` : '0MB'
                    })));
                }
            } catch (err) {
                console.error(err);
                navigate('/boardfree');
            } finally {
                setLoading(false);
            }
        };
        fetchBoardDetail();
    }, [id, navigate]);

    // 파일 로직 수정
    const handleAddFileRow = () => {
        setFileRows([...fileRows, { id: Date.now(), files: [] }]);
    };

    const handleRemoveFileRow = (rowId) => {
        setFileRows(fileRows.filter(row => row.id !== rowId));
    };

    const handleFileChange = (rowId, e) => {
        const selectedFiles = Array.from(e.target.files);
        setFileRows(fileRows.map(row => 
            row.id === rowId ? { ...row, files: selectedFiles } : row
        ));
    };

    const handleDeleteExisting = (fileId) => {
        setExistingFiles(existingFiles.filter(file => file.id !== fileId));
        setDeletedFileIds(prev => [...prev, fileId]);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const formData = new FormData();
        
        formData.append('boardTitle', title);
        formData.append('boardContent', content);
        deletedFileIds.forEach(id => formData.append('deleteFileIds', id));
        
        fileRows.forEach(row => {
            row.files.forEach(f => formData.append('newFiles', f));
        });

        try {
            const res = await fetch(`/react/board/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert('수정 완료!');
                navigate(`/boardfree/detail/${id}`);
            } else {
                throw new Error(await res.text() || '수정 실패');
            }
        } catch (err) {
            console.error(err);
            alert(`수정 중 오류 발생: ${err.message}`);
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <main className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>자유게시판 글 수정</h2>
                </div>

                <form onSubmit={handleFormSubmit}>
                    
                    <div className={styles.field}>
                        <label>제목</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
                        />
                    </div>

                    <div className={styles.field}>
                        <label>내용</label>
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)} 
                            style={{ width: '100%', height: '250px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', resize: 'none' }} 
                        />
                    </div>

                    {/* 기존 첨부파일 관리 영역 */}
                    <div className={styles.field}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>기존 첨부파일 관리</label>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, background: '#f8f9fa', borderRadius: '8px', padding: '15px' }}>
                            {existingFiles.length === 0 ? (
                                <li style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>첨부된 파일이 없습니다.</li>
                            ) : (
                                existingFiles.map(file => (
                                    <li key={file.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eaeaea' }}>
                                        <span style={{ fontSize: '14px', color: '#495057' }}> {file.name} <span style={{ color: '#adb5bd' }}>({file.size})</span></span>
                                        <button 
                                            type="button" 
                                            onClick={() => handleDeleteExisting(file.id)} 
                                            style={{ color: '#e53e3e', border: '1px solid #e53e3e', background: 'white', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            삭제
                                        </button>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    {/* 신규 첨부파일 영역 */}
                   <div className={styles.field}>
                        <div className={styles.fileHeader}>
                            <label>파일 첨부 <span style={{ fontSize: '12px', color: '#ADB5BD' }}>(최대 5MB)</span></label>
                            <button type="button" className={styles.btnAddFile} onClick={handleAddFileRow}>+ 파일 추가</button>
                        </div>
                        <div id="fileArea">
                            {fileRows.map((row, index) => (
                                <div key={row.id} className={styles.fileRow}>
                                    <input 
                                        type="file" 
                                        id={`file_input_${row.id}`}
                                        className={styles.fileInputHidden} 
                                        multiple 
                                        onChange={(e) => handleFileChange(row.id, e)}
                                    />
                                    <div className={styles.fileCustomBox} onClick={() => document.getElementById(`file_input_${row.id}`).click()}>
                                        <button type="button" className={styles.btnFile}>파일 선택</button>
                                        <span style={{ color: row.files.length > 0 ? '#1A1D23' : '#ADB5BD' }}>{row.files.length > 0 ? row.files.map(f => f.name).join(', ') : '선택된 파일 없음'}</span>
                                    </div>
                                    {index > 0 && (
                                        <button type="button" className={styles.btnRemoveFile} onClick={() => handleRemoveFileRow(row.id)}>삭제</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={styles.formActions} style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '40px' }}>
                        <button 
                            type="button" 
                            onClick={() => navigate(-1)} 
                            style={{ padding: '12px 30px', background: '#6C757D', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            취소
                        </button>
                        <button 
                            type="submit" 
                            style={{ padding: '12px 30px', background: '#378ADD', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                        >
                            수정 완료
                        </button>
                    </div>

                </form>
            </div>
        </main>
    );
};

export default BoardFreeEdit;