import Link from "next/link";

import "./not-found.css";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found-code">404</h1>
      <h2 className="not-found-title">Page Not Found</h2>
      <p className="not-found-description">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="not-found-link">
        Go Home
      </Link>
    </div>
  );
}
