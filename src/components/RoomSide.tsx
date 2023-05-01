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

  return (
    <div class='flex flex-col md:col-span-3 md:row-span-1 row-span-9 h-full gap-2 b-l'>
      <SideTabs isAdmin={props.isAdmin} selectedTab={selectedTab()} setSelectedTab={setSelectedTab} />
      <div class='flex flex-col flex-1'>
        <Switch>
          <Match when={selectedTab() === 0}>
            <SidePageChat username={props.username} channel={props.channel} />
          </Match>
          <Match when={selectedTab() === 1}>
            <SidePagePlaylist setVideoUrl={props.setVideoUrl} videoUrl={props.videoUrl} playVideo={props.playVideo} />
          </Match>
        </Switch>
      </div>
    </div>
  )
}

export default RoomSide
