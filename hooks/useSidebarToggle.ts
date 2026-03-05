import { useState } from 'react'

export function useSidebarToggle() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen((prev) => !prev)
  const close = () => setIsOpen(false)
  const open = () => setIsOpen(true)

  return { isOpen, toggle, close, open }
}
