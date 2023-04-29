import { useNavigate, useParams } from '@solidjs/router'
import type { Component } from 'solid-js'
import { For, createSignal, onMount } from 'solid-js'
import Artplayer from 'artplayer'
import supabase from '../../utils/supabase'
import { AuthGuard } from '../../utils/auth'
import Button from '../../components/ui/Button'
import Input from '~/components/ui/Input'
import ChatInput from '~/components/ChatInput'
import type { ChatMessage } from '~/types'
import ChatBubble from '~/components/ui/ChatBubble'

const Id: Component = () => {
  AuthGuard()
  const { id } = useParams<{ id: string }>()
  const channel = supabase.channel(id)
  const [isAdmin, setIsAdmin] = createSignal(false)
  const [message, setMessage] = createSignal('')
  const [videoUrl, setVideoUrl] = createSignal('')
  const [messageList, setMessageList] = createSignal<ChatMessage[]>([])
  const [onlineUsers, setOnlineUsers] = createSignal<string[]>([])
  const navigate = useNavigate()
  let player: Artplayer
  let userId: string
  let username: string

  onMount(async () => {
    const { data: roomData } = await supabase.from('Auditorium').select('*').eq('room_id', id)
    if (!roomData || roomData.length === 0)
      navigate('/', { replace: true })

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user)
      return

    userId = userData.user.id
    const { data: usernameData } = await supabase.from('Users').select('*').eq('user_id', userData.user.id)
    if (usernameData && usernameData.length > 0)
      username = usernameData[0].username ?? ''

    const { data } = await supabase.from('Auditorium').select('*').eq('room_id', id).eq('owner', userId)
    if (data && data.length > 0)
      setIsAdmin(true)

    const { data: videoUrl } = await supabase.from('Auditorium').select('video_url').eq('room_id', id)
    if (videoUrl && videoUrl.length > 0)
      setVideoUrl(videoUrl[0].video_url ?? '')
    initPlayer()
  })

  async function initPlayer() {
    player = new Artplayer({
      container: '#art-player',
      url: videoUrl(),
      volume: 0.5,
      pip: true,
      autoSize: false,
      autoMini: true,
      setting: true,
      loop: true,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      muted: true,
      miniProgressBar: true,
      mutex: true,
      theme: '#FF9000',
      moreVideoAttr: {
        crossOrigin: 'anonymous',
      },
      contextmenu: [
        {
          html: '自定义菜单',
          click: (contextmenu, player) => {
          },
        },

      ],
    })
    player.on('play', async () => {
      if (isAdmin()) {
        channel.send({
          type: 'broadcast',
          event: 'play',
          payload: '',
        })
        await supabase.from('Auditorium').update({ is_paused: false }).eq('room_id', id)
      }
    })
    player.on('pause', async () => {
      if (isAdmin()) {
        channel.send({
          type: 'broadcast',
          event: 'pause',
          payload: '',
        })
        await supabase.from('Auditorium').update({ is_paused: true }).eq('room_id', id)
      }
    })
    player.on('seek', () => {
      if (isAdmin()) {
        channel.send({
          type: 'broadcast',
          event: 'seeked',
          payload: player.currentTime,
        })
      }
    })

    const { data } = await supabase.from('Auditorium').select('current_time, is_paused').eq('room_id', id)
    if (data) {
      player.currentTime = data[0].current_time
      if (data[0].is_paused)
        player.pause()
      else
        player.play()
    }

    player.on('video:timeupdate', async () => {
      if (isAdmin())
        await supabase.from('Auditorium').update({ current_time: player.currentTime }).eq('room_id', id)
    })
  }

  channel
    .on('broadcast', { event: 'chat-message' }, (payload) => {
      setMessageList(pre => [...pre, payload.payload])
    }).on('broadcast', { event: 'play' }, () => {
      player.play()
    }).on('broadcast', { event: 'pause' }, () => {
      player.pause()
    }).on('broadcast', { event: 'seeked' }, (payload) => {
      player.currentTime = payload.payload
    }).on('broadcast', { event: 'close-room' }, () => {
      navigate('/', { replace: true })
    })
    .on('presence', { event: 'join' }, async ({ newPresences }) => {
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    })
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'Auditorium',
        filter: `room_id=eq.${id}`,
      },
      (payload) => {
        if (!player.url.includes(payload.new.video_url)) {
          setVideoUrl(payload.new.video_url)
          player.url = payload.new.video_url
          player.play()
        }
      },
    )
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user: userId,
          online_at: new Date().toLocaleTimeString(),
        })
      }
    })

  async function sendMessage() {
    if (!message())
      return
    await channel.send({
      type: 'broadcast',
      event: 'chat-message',
      payload: {
        username,
        message: message(),
      },
    })
    setMessageList(pre => [...pre,
      {
        username,
        message: message(),
      },
    ])
    setMessage('')
  }

  async function closeRoom() {
    channel.send({
      type: 'broadcast',
      event: 'close-room',
      payload: '',
    })
    await supabase.from('Auditorium').delete().eq('room_id', id)
    navigate('/', { replace: true })
  }

  async function playVideo() {
    if (!videoUrl())
      return
    await supabase.from('Auditorium').update({ video_url: videoUrl() }).eq('room_id', id)
  }

  return (
    <>
      <div class='h-15 w-full flex justify-between items-center border-b px5'>
        <button onClick={() => {
          navigate('/', { replace: true })
          channel.untrack()
        }} class='px-3 py-2 hover:bg-gray-200 transition-colors duration-300 rounded'>
          <div class='i-carbon-arrow-left' />
        </button>
        {/* <div class='flex'>
          <For each={onlineUsers()}>
            {(user, idx) => (
              <Audience username={user} />
            )}
          </For>
        </div> */}
      </div>
      <div class='grid md:grid-cols-12 md:grid-rows-1 grid-rows-12 items-center justify-center h-full '>
        <div class='flex flex-col h-full md:col-span-9 justify-start md:row-span-1 row-span-3'>
          <div id="art-player" class='w-full h-auto aspect-ratio-video object-contain'></div>
          {/* Room Information */}
          <div class='flex-1 w-full flex items-start justify-start p-5 of-hidden border'>
            <div class='flex items-start gap-2 '>
              <img src="/img.jpg" class='w-12 h-12 rounded-full'></img>
              <div class='flex flex-col items-start'>
                <h1 class='font-bold text-xl'>{id}</h1>
                <h2 class=' '>Description,Description,Description,Description</h2>
              </div>
            </div>
          </div>
        </div>
        {/* Chat */}
        <div class='flex flex-col md:col-span-3 md:row-span-1 row-span-9 h-full gap-2 p-3'>
          <div class='flex flex-col flex-1 of-y-auto'>
            <For each={messageList()}>
              {(message, idx) => (
                <ChatBubble username={message.username} message={message.message} />
              )}
            </For>
          </div>
          {isAdmin()
            ? <>
              <Input value={videoUrl()} setValue={setVideoUrl} />
              <Button onClick={playVideo} title='播放' />
            </>
            : null}

          <form onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }} class='flex flex-col gap-2'>
            <ChatInput value={message()} setValue={setMessage} />
            <div class='flex justify-end'>
              <Button type='submit' title='发送' class='w-20' />
            </div>
          </form>
          {/* <Button onClick={closeRoom} title='关闭房间' /> */}
        </div>
      </div>
    </>
  )
}

export default Id
