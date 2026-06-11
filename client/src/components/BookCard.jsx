import { getBookTheme, getInitial, getTagColorClass } from "../utils/bookTheme.js";

export default function BookCard({ book, score, onBuy, onOffline, onOnline, onView }) {
  const theme = getBookTheme(book.category);
  const sellerName = book.owner?.nickname || "校内同学";

  return (
    <article className={`card book-card ${theme}`}>
      <div className="book-card-top">
        {book.imageUrls?.[0] && <img className="book-image" src={book.imageUrls[0]} alt={book.title} />}
        {book.category && <span className="category-pill">{book.category}</span>}
        {typeof score === "number" && <span className="score-pill">AI {Math.round(score)}</span>}
      </div>
      <div className="card-title">
        <h3>{book.title}</h3>
        <span className="price">¥{book.price}</span>
      </div>
      <p className="book-meta-line">
        <span>{book.courseName || "未绑定课程"}</span>
        <span className="dot">·</span>
        <span>{book.condition}</span>
      </p>
      <p className="muted">{book.description}</p>
      <div className="seller-chip">
        <span className="seller-avatar">{getInitial(sellerName)}</span>
        <span>{sellerName}{book.owner?.campus ? ` · ${book.owner.campus}` : ""}</span>
      </div>
      <div className="tags">
        {(book.tags || []).slice(0, 4).map((tag, index) => (
          <span key={tag} className={getTagColorClass(tag, index)}>{tag}</span>
        ))}
      </div>
      <div className="actions">
        {onView && <button className="ghost" onClick={() => onView(book._id)}>查看详情</button>}
        {onBuy && <button className="accent" onClick={() => onBuy(book._id)}>一键求书</button>}
        {onOffline && book.status !== "offline" && <button className="ghost" onClick={() => onOffline(book._id)}>下架</button>}
        {onOnline && book.status === "offline" && <button className="accent" onClick={() => onOnline(book._id)}>重新上架</button>}
      </div>
    </article>
  );
}
