'use client' 
 
import { useEffect } from 'react'
import { Button } from '@nextui-org/button'

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])
 
  return (
    <div>
      <h2>Something went wrong!</h2>
      <br />
      <Button
      color='danger'
        onClick={
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  )
}