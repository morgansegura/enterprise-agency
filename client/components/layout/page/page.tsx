import { cn } from '@/lib/utils'
import './page.css'

type PageProps = {
  children: React.ReactNode
  /** Optional header component */
  header?: React.ReactNode
  /** Optional footer component */
  footer?: React.ReactNode
  /** Header positioning behavior */
  headerPosition?: 'static' | 'sticky' | 'fixed'
  className?: string
}

export function Page({
  children,
  header,
  footer,
  headerPosition = 'static',
  className
}: PageProps) {
  return (
    <div className={cn("page", className)}>
      {header && (
        <header
          className="page-header"
          data-position={headerPosition}
        >
          {header}
        </header>
      )}

      <main className="page-main">
        {children}
      </main>

      {footer && (
        <footer className="page-footer">
          {footer}
        </footer>
      )}
    </div>
  )
}