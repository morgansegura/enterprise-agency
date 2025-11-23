import "./auth-layout.css";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return <div className="auth-layout">{children}</div>;
}
