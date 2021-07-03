import React, { ReactNode, MouseEvent } from 'react'

import { useRouter } from './hooks'

// const BaseLink = styled.a`
//   display: inline-block;
// `

type Props = {
  as?: 'span'
  className?: string
  href: string
  children: ReactNode
}

function Link({ href, as, children, ...props }: Props) {
  const router = useRouter()

  function onClick(event: MouseEvent) {
    event.preventDefault()
    router.push(href)
  }

  // if (as) {
  //   return (
  //     <a onClick={(event: MouseEvent) => onClick(event)} {...props} as={as}>
  //       {children}
  //     </a>
  //   )
  // }

  return (
    <a href={href} onClick={(event: MouseEvent) => onClick(event)} {...props}>
      {children}
    </a>
  )
}

export { Link }
