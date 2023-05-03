import { Component, Match, Switch, createEffect, createResource, onMount } from 'solid-js'
import { createSignal } from 'solid-js'
import type { RealtimeChannel } from '@supabase/supabase-js'
import SideTabs from './SideTabs'
import type { BaseResp, ChatMessage, Content, List } from '~/types'
import SidePageChat from './SidePageChat'
import SidePagePlaylist from './SidePagePlaylist'
import { userStore } from '~/stores/userStore'
import axios from 'axios'

interface Props {
  playVideo: (url: string) => Promise<void>
  channel: RealtimeChannel
}

const fetchList = async (path: string) => {
  return new Promise(async (resolve, reject) => {
    axios.post<BaseResp<List>>('/api/fs/list', { path: path }).then((resp) => {
      if (resp.data.code === 200) {
        resolve(resp.data.data.content)
      }
      else {
        reject(resp.data.message)
      }
    })
  })
}

const RoomSide: Component<Props> = (props) => {
  const [selectedTab, setSelectedTab] = createSignal(0)
  const [messageList, setMessageList] = createSignal<ChatMessage[]>([])
  const [path, setPath] = createSignal('/WHT-Public')
  const [list] = createResource(path, fetchList)
  const hasParent = () => path() !== '/WHT-Public'

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
        username: userStore.username,
        message: message,
      },
    })
    setMessageList(pre => [...pre,
    {
      username: userStore.username,
      message: message,
    },
    ])
  }

  async function handleCheckDicOrFile(item: Content) {
    if (item.is_dir) {
      setPath(pre => pre + '/' + item.name)
    }
    else {
      const pathName = path() + '/' + item.name
      const data = await axios.post('/api/fs/other', {
        path: pathName, method: "video_preview"
      })
      const list = data.data.data.video_preview_play_info.live_transcoding_task_list
      const url = list[list.length - 1].url
      props.playVideo(url)
    }
  }

  function onNavBack() {
    const arr = path().split('/')
    arr.pop()
    setPath(arr.join('/'))
  }

  return (
    <div class='h-full flex flex-col of-hidden b-x md:w-80'>
      <SideTabs selectedTab={selectedTab()} setSelectedTab={setSelectedTab} />
      <Switch>
        <Match when={selectedTab() === 0}>
          <SidePageChat messageList={messageList()} sendMessage={sendMessage} />
        </Match>
        <Match when={selectedTab() === 1}>
          <SidePagePlaylist checkDicOrFile={handleCheckDicOrFile} playVideo={props.playVideo} list={list() as Content[]} hasParent={hasParent()} onNavBack={onNavBack} />
        </Match>
      </Switch>
    </div>
  )
}

export default RoomSide
