import { Component, Match, Switch } from 'solid-js'
import { For, createSignal } from 'solid-js'
import type { RealtimeChannel } from '@supabase/supabase-js'
import ChatBubble from './ui/ChatBubble'
import Input from './ui/Input'
import Button from './ui/Button'
import ChatInput from './ChatInput'
import SideTabs from './SideTabs'
import type { ChatMessage } from '~/types'
import SidePageChat from './SidePageChat'
import SidePagePlaylist from './SidePagePlaylist'

interface Props {
  isAdmin: boolean
  videoUrl: string
  setVideoUrl: (_: string) => void
  playVideo: () => void
  channel: RealtimeChannel
  username: string
}

const RoomSide: Component<Props> = (props) => {
  const [selectedTab, setSelectedTab] = createSignal(0)
  const [messageList, setMessageList] = createSignal<ChatMessage[]>([])

  props.channel
    .on('broadcast', { event: 'chat-message' }, (payload) => {
      setMessageList(pre => [...pre, payload.payload])
    })

  async function sendMessage(message: string) {
    if (!message)
      return
    await props.channel.send({
      type: 'broadcast',
      event: 'chat-message',
      payload: {
        username: props.username,
        message: message,
      },
    })
    setMessageList(pre => [...pre,
    {
      username: props.username,
      message: message,
    },
    ])
  }

  return (
    <div class='md:w-1/4 b-x h-full flex flex-col gap-2 of-hidden'>
      <SideTabs isAdmin={props.isAdmin} selectedTab={selectedTab()} setSelectedTab={setSelectedTab} />
      <Switch>
        <Match when={selectedTab() === 0}>
          <SidePageChat messageList={messageList()} sendMessage={sendMessage} />
        </Match>
        <Match when={selectedTab() === 1}>
          <SidePagePlaylist setVideoUrl={props.setVideoUrl} videoUrl={props.videoUrl} playVideo={props.playVideo} />
        </Match>
      </Switch>
    </div>
  )
}

export default RoomSide
