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

export interface List {
  content: Content[]
  provider: string
  readme: string
  total: number
  write: boolean
}

export interface Content {
  name: string;
  size: number;
  is_dir: boolean;
  modified: Date;
  sign: string;
  thumb: string;
  type: number;
}

export interface BaseResp<T> {
  code: number;
  message: string;
  data: T;
}
