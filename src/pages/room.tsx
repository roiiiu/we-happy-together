import { Outlet } from '@solidjs/router'
import type { Component } from 'solid-js'

const Room: Component = () => {
  return (
  <div class='flex h-screen w-full'>
    <Outlet/>
  </div>
  )
}

export default Room
