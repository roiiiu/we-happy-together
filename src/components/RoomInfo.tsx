import type { Component } from 'solid-js'

interface Props {
  id: string
}

const RoomInfo: Component<Props> = (props) => {
  return (
    <div class='flex-1 w-full flex items-start justify-start p-3 b-b items-center of-hidden'>
      <img src="/img.jpg" class='w-12 h-12 rounded-full' />
      <div class='of-hidden ml-2'>
        <h1 class='font-bold text-xl'>{props.id}</h1>
        <h2 class='truncate'>Description,Description,Description,Description</h2>
      </div>
    </div>
  )
}

export default RoomInfo
