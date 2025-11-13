import { cn } from '@/lib/utils'
import './page.css'

type PageProps = {
  children: React.ReactNode
  className?: string
}

export function Page({children, className}: PageProps) {
  return (
    <div className={cn("page", className)}>
      {children}
    </div>
  )
}