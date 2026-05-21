export default function StarRating({ value, onChange, readonly = false }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (value || 0) ? 'filled' : ''}`}
          onClick={() => !readonly && onChange && onChange(star)}
          style={readonly ? { cursor: 'default' } : {}}
        >
          ★
        </span>
      ))}
    </div>
  );
}
