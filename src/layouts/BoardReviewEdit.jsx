import { useState, useRef } from 'react';
import styles from './BoardReviewEdit.module.css';

const BoardReviewEdit = () => {
    const [title, setTitle] = useState("청년 주거지원 정책 관련해서 질문 있습니다!");
    const [content, setContent] = useState("안녕하세요, 이번에 주거지원 정책을 알아보려고 하는데...");
    const [rating, setRating] = useState(4); // 기존 별점 초기값
    const [selectedService, setSelectedService] = useState("청년 월세 지원");

    const [existingFiles, setExistingFiles] = useState([
        { id: 1, name: '주거지원_정책안내_가이드.pdf', size: '1.2MB' }
    ]);
    const [deletedFileIds, setDeletedFileIds] = useState([]);
    const nextRowId = useRef(1);
    const [newFileRows, setNewFileRows] = useState([{ id: 0, fileNameDisplay: '선택된 파일 없음', hasFile: false }]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const fileInputRefs = useRef({});

    const handleDeleteExisting = (id) => {
        setExistingFiles(existingFiles.filter(file => file.id !== id));
        setDeletedFileIds([...deletedFileIds, id]);
    };

    const handleAddNewRow = () => {
        setNewFileRows([...newFileRows, { id: nextRowId.current, fileNameDisplay: '선택된 파일 없음', hasFile: false }]);
        nextRowId.current += 1;
    };

    const handleRemoveNewRow = (id) => {
        setNewFileRows(newFileRows.filter(row => row.id !== id));
    };

    const triggerFileInput = (id) => { fileInputRefs.current[id]?.click(); };

    const handleFileChange = (e, id) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setNewFileRows(newFileRows.map(row => row.id === id ? { ...row, fileNameDisplay: files[0].name, hasFile: true } : row));
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        alert('수정이 완료되었습니다!');
    };

    return (
        <main className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>후기게시판 글 수정</h2>
                </div>

                <form onSubmit={handleFormSubmit}>
                    <div className={styles.field}>
                        <label>연결된 복지 서비스</label>
                        <div className={styles.row}>
                            <input type="text" value={selectedService} readOnly />
                            <button type="button" className={styles.btnLoad}>복지글 변경</button>
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>만족도</label>
                        <div className={styles.starContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className={star <= rating ? styles.starFilled : styles.starEmpty} onClick={() => setRating(star)}>★</span>
                            ))}
                        </div>
                    </div>

                    <div className={styles.field}>
                        <label>제목</label>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>

                    <div className={styles.field}>
                        <label>내용</label>
                        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                    </div>

                    <div className={styles.formActions}>
                        <button type="button" className={styles.btnCancel} onClick={() => window.history.back()}>취소</button>
                        <button type="submit" className={styles.btnSubmit}>수정 완료</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default BoardReviewEdit;