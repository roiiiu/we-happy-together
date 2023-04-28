import { useNavigate, useParams } from '@solidjs/router'
import type { Component } from 'solid-js'
import { For, createSignal, onMount } from 'solid-js'
import Artplayer from 'artplayer'
import supabase from '../../utils/supabase'
import { AuthGuard } from '../../utils/auth'
import Button from '../../components/Button'

const Id: Component = () => {
  AuthGuard()
  const { id } = useParams < { id: string }>()
  const channel = supabase.channel(id)
  const [isAdmin, setIsAdmin] = createSignal(false)
  const [input, setInput] = createSignal('')
  const [messageList, setMessageList] = createSignal<string[]>([])
  const navigate = useNavigate()
  let player: Artplayer

  onMount(async () => {
    const { data: roomData } = await supabase.from('Auditorium').select('*').eq('room_id', id)
    if (!roomData || roomData.length === 0)
      navigate('/', { replace: true })

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user)
      return

    const { data } = await supabase.from('Auditorium').select('*').eq('room_id', id).eq('owner', userData.user.id)
    if (data && data.length > 0)
      setIsAdmin(true)

    initPlayer()
  })

  function initPlayer() {
    player = new Artplayer({
      container: '.art-player',
      url: 'https://artplayer.org/assets/sample/video.mp4',
      volume: 0.5,
      pip: true,
      autoSize: true,
      autoMini: true,
      screenshot: true,
      setting: true,
      loop: true,
      flip: true,
      autoplay: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      muted: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      theme: '#ffad00',
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
    player.on('play', () => {
      if (isAdmin()) {
        channel.send({
          type: 'broadcast',
          event: 'play',
          payload: '',
        })
      }
    })
    player.on('pause', () => {
      if (isAdmin()) {
        channel.send({
          type: 'broadcast',
          event: 'pause',
          payload: '',
        })
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
  }

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED')
      // eslint-disable-next-line no-console
      console.log('Successfully subscribed to room.')
  })

  supabase
    .channel(id)
    .on('broadcast', { event: 'chat-message' }, (payload) => {
      setMessageList(pre => [...pre, payload.payload])
    }).on('broadcast', { event: 'play' }, () => {
      player.play()
    }).on('broadcast', { event: 'pause' }, () => {
      player.pause()
    }).on('broadcast', { event: 'seeked' }, (payload) => {
      player.currentTime = payload.payload
    })

  function sendMessage() {
    channel.send({
      type: 'broadcast',
      event: 'chat-message',
      payload: input(),
    })
    setInput('')
  }

  return (
  <div class='flex flex-col items-center justify-center h-screen w-full'>
    {isAdmin() ? <div>admin</div> : <div>not admin</div>}
    <input class='border' value={input()} onChange={(e) => { setInput(e.target.value) }}/>
    <div class='art-player w-150 h-80'></div>
    <Button onClick={sendMessage} title='发送'/>
    <For each={messageList()}>
    {(message, idx) => (
      <div>{message}</div>
    )}
    </For>
  </div>
  )
}

export default Id
