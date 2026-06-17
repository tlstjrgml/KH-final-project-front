import styles from './declaration.module.css';

const Declaration = () =>{
    return(
        <div id="reportModal" className={styles.reportModalOverlay}>
            <div className={styles.reportModalContent}>
                <h3 className={styles.reportModalTitle}>신고하기</h3>
                <textarea id="reportReason" className={styles.reportTextarea} placeholder="신고사유 입력"></textarea>
                <div className={styles.reportActions}>
                    {/* <!-- 취소, 확인 기능은 자유게시판 상세 페이지에 삽입 시 로직 연동을 위해 비워두었습니다 --> */}
                    <button type="button" className={`${styles.modalBtn} ${styles.cancel}`} id="closeModal" onClick={() => { }}>취소</button>
                    <button type="button" className={`${styles.modalBtn} ${styles.confirm}`} id="moveBoard" onClick={() => { }}>확인</button>
                </div>
            </div>
        </div>
    )
}

export default Declaration;