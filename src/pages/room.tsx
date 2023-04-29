import { Outlet } from '@solidjs/router'
import type { Component } from 'solid-js'

const Room: Component = () => {
  return (
  <div class='h-screen w-full p-8'>
    <Outlet/>
  </div>
  )
}

export default Room
