import React, { ReactNode, MouseEvent } from 'react'

import { useRouter } from './hooks'

type Props = {
  href: string
  children: ReactNode
  shallow?: boolean
  scroll?: boolean
}

function Link({ href, children, shallow, scroll, ...props }: Props) {
  const router = useRouter()

  function onClick(event: MouseEvent) {
    event.preventDefault()
    router.push(href, { shallow, scroll })
  }

  return (
    <a href={href} onClick={(event: MouseEvent) => onClick(event)} {...props}>
      {children}
    </a>
  )
}

export { Link }
