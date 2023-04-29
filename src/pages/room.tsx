import { Outlet, useNavigate } from '@solidjs/router'
import type { Component } from 'solid-js'

const Room: Component = () => {
  const navigate = useNavigate()
  return (
    <div class='absolute inset-0 flex flex-col'>
      <Outlet />
    </div>
  )
}

export default Room
