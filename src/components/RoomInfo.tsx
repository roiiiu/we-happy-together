import type { Component } from 'solid-js'

interface Props {
  id: string
}

const RoomInfo: Component<Props> = (props) => {
  return (
    <div class='flex-1 w-full flex items-start justify-start p-5 of-hidden'>
      <div class='flex items-start gap-2 '>
        <img src="/img.jpg" class='w-12 h-12 rounded-full' />
        <div class='flex flex-col items-start'>
          <h1 class='font-bold text-xl'>{props.id}</h1>
          <h2 class=' '>Description,Description,Description,Description</h2>
        </div>
      </div>
    </div>
  )
}

export default RoomInfo
