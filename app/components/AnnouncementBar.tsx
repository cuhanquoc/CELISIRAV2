const ANNOUNCEMENT_ITEMS = [
  'Free shipping on orders over $50',
  'New arrivals every Friday',
  'Returns within 30 days',
];

export function AnnouncementBar() {
  const content = ANNOUNCEMENT_ITEMS.join(' • ');

  return (
    <div
      className="announcement-bar"
      role="status"
      aria-live="polite"
      aria-label="Store announcements"
    >
      <span className="sr-only">{content}</span>
      <div className="announcement-bar-track" aria-hidden>
        <span>{content}</span>
        <span>{content}</span>
      </div>
    </div>
  );
}
