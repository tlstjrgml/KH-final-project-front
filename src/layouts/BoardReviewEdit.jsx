import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './BoardReviewEdit.module.css';

const BoardReviewEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [selectedWelfare, setSelectedWelfare] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const [existingFiles, setExistingFiles] = useState([
        { id: 1, name: '주거지원_정책안내_가이드.pdf', size: '1.2MB' }
    ]);
    const [deletedFileIds, setDeletedFileIds] = useState([]);
    const nextRowId = useRef(1);
    const [newFileRows, setNewFileRows] = useState([{ id: 0, fileNameDisplay: '선택된 파일 없음', hasFile: false }]);
    const fileInputRefs = useRef({});

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`/react/board/${id}`, {
                    headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                });
                if (!res.ok) throw new Error('게시글 조회 실패');
                const data = await res.json();

                if (!data.isOwner) {
                    alert('본인이 작성한 게시글만 수정할 수 있습니다.');
                    navigate(`/boardreview/detail/${id}`);
                    return;
                }

                setTitle(data.boardTitle);
                setContent(data.boardContent);

                // 기존에 연결된 복지서비스의 실제 정책명을 불러와서 selectedWelfare에 채움
                if (data.welfareId) {
                    const wRes = await fetch(`/api/welfare/detail/${data.welfareId}`);
                    if (wRes.ok) {
                        const wData = await wRes.json();
                        setSelectedWelfare({ welfareId: data.welfareId, plcyNm: wData.plcyNm });
                    } else {
                        setSelectedWelfare({ welfareId: data.welfareId, plcyNm: '복지서비스 정보를 불러올 수 없음' });
                    }
                }
            } catch (err) {
                console.error(err);
                alert('게시글을 불러오지 못했습니다.');
                navigate('/boardreview');
            } finally {
                setLoading(false);
            }
        };
        fetchBoard();
    }, [id, navigate]);

    const handleSearch = async () => {
        try {
            const res = await fetch(`/api/welfare/list?keyword=${encodeURIComponent(searchKeyword)}`);
            if (!res.ok) throw new Error('검색 실패');
            const data = await res.json();
            setSearchResults(data.list || []);
        } catch (err) {
            console.error(err);
            alert('검색 중 오류가 발생했습니다.');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const selectWelfare = (item) => {
        setSelectedWelfare(item);
        setIsModalOpen(false);
        setSearchResults([]);
        setSearchKeyword('');
    };

    const handleDeleteExisting = (fileId) => {
        setExistingFiles(existingFiles.filter(file => file.id !== fileId));
        setDeletedFileIds([...deletedFileIds, fileId]);
    };

    const handleAddNewRow = () => {
        setNewFileRows([...newFileRows, { id: nextRowId.current, fileNameDisplay: '선택된 파일 없음', hasFile: false }]);
        nextRowId.current += 1;
    };

    const handleRemoveNewRow = (rowId) => {
        setNewFileRows(newFileRows.filter(row => row.id !== rowId));
    };

    const triggerFileInput = (rowId) => { fileInputRefs.current[rowId]?.click(); };

    const handleFileChange = (e, rowId) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setNewFileRows(newFileRows.map(row => row.id === rowId ? { ...row, fileNameDisplay: files[0].name, hasFile: true } : row));
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!selectedWelfare) {
            alert('연결할 복지 서비스를 선택해주세요.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        try {
            const res = await fetch(`/react/board/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    boardTitle: title,
                    boardContent: content,
                    welfareId: selectedWelfare.welfareId
                })
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || '수정 실패');
            }

            alert('수정이 완료되었습니다!');
            navigate(`/boardreview/detail/${id}`);
        } catch (err) {
            console.error(err);
            alert(`수정 중 오류가 발생했습니다: ${err.message}`);
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <main className={styles.page}>
            <div className={styles.writeCard}>
                <div className={styles.writeHeader}>
                    <h2 className={styles.writeTitle}>후기게시판 글 수정</h2>
                </div>

                {isModalOpen && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalContent}>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>&times;</button>
                            <h3>복지 서비스 검색</h3>
                            <div className={styles.searchBox}>
                                <input
                                    type="text"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="검색어를 입력하세요"
                                />
                                <button onClick={handleSearch}>검색</button>
                            </div>
                            <ul className={styles.resultList}>
                                {searchResults.map((item) => (
                                    <li key={item.welfareId} className={styles.resultItem} onClick={() => selectWelfare(item)}>
                                        {item.plcyNm}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                <form onSubmit={handleFormSubmit}>
                    <div className={styles.field}>
                        <label>연결된 복지 서비스</label>
                        <div className={styles.row}>
                            <input type="text" value={selectedWelfare ? selectedWelfare.plcyNm : ''} readOnly />
                            <button type="button" className={styles.btnLoad} onClick={() => setIsModalOpen(true)}>복지글 변경</button>
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

                    {/* 파일 첨부 */}
                    <div className={styles.field}>
                        <label>파일 첨부</label>
                        <div className={styles.fileCustomBox}>
                            <button type="button" className={styles.btnFile}>파일 선택</button>
                            <span className={styles.fileName}>선택된 파일 없음</span>
                        </div>
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