'use client'

import { Download } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

interface ResumeDownloadButtonProps {
  className?: string
}

export function ResumeDownloadButton({ className }: ResumeDownloadButtonProps) {
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = '/resume.pdf'
    a.download = 'resume.pdf'
    a.click()
  }

  return (
    <Button
      onClick={handleDownload}
      className={cn(
        'rounded-full bg-primary-700 px-6 py-3 text-base hover:bg-primary-800',
        className
      )}
    >
      <Download className="h-5 w-5 mr-2" />
      Download Resume
    </Button>
  )
}
