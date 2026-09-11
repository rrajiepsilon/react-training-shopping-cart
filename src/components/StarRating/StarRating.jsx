import "./StarRating.css";

export default function StarRating({ rate = 0, count = 0, size = 12 }) {
  const rounded = Math.round(rate);

  return (
    <div className="star-rating" role="img" aria-label={`Rated ${rate.toFixed(1)} out of 5 stars, ${count} reviews`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= rounded ? "var(--color-accent-star)" : "var(--color-border)"}
          stroke={i <= rounded ? "var(--color-accent-star)" : "var(--color-border)"}
          aria-hidden="true"
        >
          <polygon points="12 2 15 9 22 9 16.5 13.5 18.5 21 12 17 5.5 21 7.5 13.5 2 9 9 9" />
        </svg>
      ))}
      <span className="star-rating-count" aria-hidden="true">
        {rate.toFixed(1)} · {count}
      </span>
    </div>
  );
}
