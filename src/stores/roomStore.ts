import { createStore, produce } from 'solid-js/store'
import { WatchRoom } from '~/types'

interface RoomStoreProps {
  room: WatchRoom
  isAdmin: boolean
}

const [roomStore, setRoomStore] = createStore<RoomStoreProps>({
  room: {} as WatchRoom,
  isAdmin: false
})

const updateRoom = (room: WatchRoom) => {
  setRoomStore('room', room)
}

const updateRoomPublic = (isPublic: boolean) => {
  setRoomStore('room', produce((room) => {
    room.is_public = isPublic
  }))
}

const updateRoomName = (name: string) => {
  setRoomStore('room', produce((room) => {
    room.room_name = name
  }))
}

const updateRoomDescription = (description: string) => {
  setRoomStore('room', produce((room) => {
    room.description = description
  }))
}

const updateRoomVideoUrl = (videoUrl: string) => {
  setRoomStore('room', produce((room) => {
    room.video_url = videoUrl
  }))
}

const updateRoomAdmin = (isAdmin: boolean) => {
  setRoomStore('isAdmin', isAdmin)
}

export { roomStore, updateRoom, updateRoomPublic, updateRoomName, updateRoomDescription, updateRoomAdmin, updateRoomVideoUrl }
