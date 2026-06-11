import styles from './BoardFreeDetail.module.css'

const  BoardFreeDetail = () =>{
     return(
        <main className={styles.page}>
            <div className={styles.contentWrapper}>

                <span className={styles.categoryLabel}>자유게시판</span>

                <div className={styles.detailCard}>

                {/* 게시글 헤더 */}
                <div className={styles.postHeader}>
                    <h1 className={styles.postTitle}>청년 주거지원 정책 관련해서 질문 있습니다!</h1>
                    <div className={styles.postMetaContainer}>
                        <div className={styles.postMetaLeft}>
                            <span>작성자: <b>김청년</b></span>
                            <span className={styles.metaDivider}>|</span>
                            <span>조회수: 152</span>
                            <span className={styles.metaDivider}>|</span>
                            <span>2024.05.20 14:30</span>
                        </div>
                        <div className={styles.postMetaRight}>
                            <button className={styles.actionBtn} onClick={() => {location.href=''}}>수정</button>
                            <span className={styles.metaDivider}>|</span>
                            <button className={`${styles.actionBtn} ${styles.danger}`}>삭제</button>
                            <span className={styles.metaDivider}>|</span>
                            <button  className={`${styles.actionBtn} ${styles.danger}`}>신고</button>
                        </div>
                    </div>
                </div>

                {/*게시글 본문 */}
                <div className={styles.postContent}>
                    안녕하세요, 이번에 주거지원 정책을 알아보려고 하는데 여러 가지 헷갈리는 부분이 있어서 질문 남깁니다.<br/><br/>
                    소득 분위 산정 기준이 세전인지 세후인지, 그리고 부모님과 떨어져 살아도 부모님 소득이 합산되는지 궁금합니다.<br/>
                    혹시 최근에 신청해보신 분 계시면 답변 부탁드리겠습니다! 감사합니다.
                </div>

                {/* 첨부파일 */}
                <div className={styles.attachmentBox}>
                    <div className={styles.attachmentTitle}>
                    <svg viewBox="0 0 24 24"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    첨부파일
                    </div>
                    <ul className={styles.attachmentList}>
                    <li>
                        <a href="#" className={styles.attachmentLink}>주거지원_정책안내_가이드.pdf <span className={styles.attachmentSize}>(1.2MB)</span></a>
                    </li>
                    </ul>
                </div>

                {/* 좋아요 */}
                <div className={styles.likeActionArea}>
                    <button id="btn-post-like" className={styles.btnLike} onClick={() => {togglePostLike()}}>
                    <svg viewBox="0 0 24 24"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                    좋아요 <span id="post-like-count">15</span>
                    </button>
                </div>

                {/*댓글 영역 */}
                <div className={styles.commentSection}>
                    <h3 className={styles.commentHeader}>댓글 <span style={{color: '#378ADD'}}>2</span></h3>

                    <form action="/reply/insert" method="POST" className={styles.commentForm}>
                        <input type="hidden" name="ref_id" value="123"/>
                        <input type="hidden" name="code" value="B"/>
                        <input type="text" className={styles.commentInput} name="reply_content" placeholder="댓글을 입력해 주세요..." required/>
                        <button type="submit" className={styles.btnCommentSubmit}>댓글 등록</button>
                    </form>

                    <div className={styles.commentList}>

                    <div className={styles.commentItem} id="reply-1">
                        <div className={styles.commentInfo}>
                        <span className={styles.commentAuthor}>박복지</span>
                        <span className={styles.commentDate}>2024.05.20 15:00</span>
                        </div>
                        <div className={styles.commentText}>저도 그 부분이 헷갈리더라고요. 아시는 분 답변 부탁드립니다!</div>
                        <div className={styles.commentActions}>
                        <button className={styles.actionBtn} onClick={() => {toggleCommentLike('cnt-1')}}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                            좋아요 <span id="cnt-1">2</span>
                        </button>
                        <span className={styles.metaDivider}>|</span>
                        <button className={styles.actionBtn} onClick={() => {toggleReplyForm(1)}}>대댓글</button>
                        <span className={styles.metaDivider}>|</span>
                        <button className={styles.actionBtn}>수정</button>
                        <button className={`${styles.actionBtn} ${styles.danger}`}>삭제</button>
                        <span className={styles.metaDivider}>|</span>
                        <button className={`${styles.actionBtn} ${styles.danger}`}>신고</button>
                        </div>
                        <form action="/reply/insert" method="POST" className={`${styles.commentForm} ${styles.replyFormWrapper}`} id="reply-form-1">
                            <div className={styles.replyIndicator}>↳</div>
                            <input type="hidden" name="ref_id" value="1"/>
                            <input type="hidden" name="code" value="R"/>
                            <input type="text" className={styles.commentInput} name="reply_content" placeholder="대댓글을 입력해 주세요..." required/>
                            <button type="submit" className={styles.btnCommentSubmit} style={{background:' #6C757D'}}>등록</button>
                        </form>
                    </div>

                    <div className={styles.commentItem} id="reply-2">
                        <div className={styles.commentInfo}>
                        <span className={styles.commentAuthor}>지식인청년</span>
                        <span className={styles.commentDate}>2024.05.20 16:30</span>
                        </div>
                        <div className={styles.commentText}>소득은 가구원 수에 따른 기준 중위소득(세전 기준)으로 산정합니다. 부모님과 주민등록상 세대가 분리되어 있으면 본인 소득만 봅니다!</div>
                        <div className={styles.commentActions}>
                        <button className={styles.actionBtn} onClick={() => {toggleCommentLike('cnt-2')}}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                            좋아요 <span id="cnt-2">8</span>
                        </button>
                        <span className={styles.metaDivider}>|</span>
                        <button className={styles.actionBtn} onClick={() => {toggleReplyForm(2)}}>대댓글</button>
                        <span className={styles.metaDivider}>|</span>
                        <button className={`${styles.actionBtn} ${styles.danger}`}>신고</button>
                        </div>
                        <form action="/reply/insert" method="POST" className={`${styles.commentForm} ${styles.replyFormWrapper}`} id="reply-form-2">
                            <div className={styles.replyIndicator}>↳</div>
                            <input type="hidden" name="ref_id" value="2"/>
                            <input type="hidden" name="code" value="R"/>
                            <input type="text" className={styles.commentInput} name="reply_content" placeholder="대댓글을 입력해 주세요..." required/>
                            <button type="submit" className={styles.btnCommentSubmit} style={{background: '#6C757D'}}>등록</button>
                        </form>
                    </div>

                    </div>

                    <div className={styles.pagination}>
                    <a href="#" className={styles.pageItem}>&lt;</a>
                    <a href="#" className={`${styles.pageItem} ${styles.active}`}>1</a>
                    <a href="#" className={styles.pageItem}>2</a>
                    <a href="#" className={styles.pageItem}>3</a>
                    <a href="#" className={styles.pageItem}>4</a>
                    <a href="#" className={styles.pageItem}>&gt;</a>
                    </div>

                </div>
                </div> {/* detail-card */}

                <div className={styles.bottomActions}>
                <a href="board_list.html" className={styles.btnList}>
                    <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
                    목록으로
                </a>
                </div>

            </div>
        </main>
    );

}
export default BoardFreeDetail;