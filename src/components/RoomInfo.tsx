import type { Component } from 'solid-js'
import { roomStore } from '~/stores/roomStore'

const RoomInfo: Component = (props) => {
  return (
    <div class='w-full flex flex-1 items-start items-center justify-start of-hidden b-b p-3'>
      <img src="/img.jpg" class='h-12 w-12 rounded-full' />
      <div class='ml-2 of-hidden'>
        <h1 class='text-xl font-bold'>{roomStore.room.room_name}</h1>
        <h2 class='truncate text-sm'>{roomStore.room.description}</h2>
      </div>
    </div>
  )
}

export default RoomInfo
