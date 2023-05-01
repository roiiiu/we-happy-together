export interface ChatMessage {
  username: string
  message: string
}

export interface WatchRoom {
  id: string
  owner: string
  is_public: boolean
  room_id: string
  video_url: string
  description: string
  room_name: string
  current_time: number
  is_paused: boolean
}
