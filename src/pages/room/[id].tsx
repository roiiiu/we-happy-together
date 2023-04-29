/* eslint-disable no-console */
import { useNavigate, useParams } from '@solidjs/router'
import type { Component } from 'solid-js'
import { For, createSignal, onMount } from 'solid-js'
import Artplayer from 'artplayer'
import supabase from '../../utils/supabase'
import { AuthGuard } from '../../utils/auth'
import Button from '../../components/Button'

const Id: Component = () => {
  AuthGuard()
  const { id } = useParams<{ id: string }>()
  const channel = supabase.channel(id)
  const [isAdmin, setIsAdmin] = createSignal(false)
  const [input, setInput] = createSignal('')
  const [videoUrl, setVideoUrl] = createSignal('')
  const [messageList, setMessageList] = createSignal<string[]>([])
  const navigate = useNavigate()
  let player: Artplayer
  let userId: string

  onMount(async () => {
    const { data: roomData } = await supabase.from('Auditorium').select('*').eq('room_id', id)
    if (!roomData || roomData.length === 0)
      navigate('/', { replace: true })

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user)
      return
    userId = userData.user.id

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
      autoSize: true,
      autoMini: true,
      setting: true,
      loop: true,
      flip: true,
      playbackRate: true,
      aspectRatio: true,
      fullscreen: true,
      fullscreenWeb: true,
      muted: true,
      subtitleOffset: true,
      miniProgressBar: true,
      mutex: true,
      theme: '#ffffff',
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
    .on('presence', { event: 'join' }, ({ key, newPresences }) => {
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    }).on(
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
      if (status === 'SUBSCRIBED')
        console.log('Successfully subscribed to room.')
      await channel.track({
        user: userId,
        online_at: new Date().toLocaleTimeString(),
      })
    })

  function sendMessage() {
    channel.send({
      type: 'broadcast',
      event: 'chat-message',
      payload: input(),
    })
    setMessageList(pre => [...pre, input()])
    setInput('')
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
    <div class='grid grid-cols-12 items-center justify-center h-full gap-5'>
      <div id="art-player" class='h-full col-span-10'></div>
      <div class='flex flex-col col-span-2 h-full'>
        <div class='flex flex-col flex-1'>
          <For each={messageList()}>
            {(message, idx) => (
              <div>{message}</div>
            )}
          </For>
        </div>
        <input class='border' value={input()} onChange={(e) => { setInput(e.target.value) }} />
        {isAdmin() ? <div>admin</div> : <div>not admin</div>}
        <input class='border' value={videoUrl()} onChange={(e) => { setVideoUrl(e.target.value) }}/>
        <Button onClick={playVideo} title='播放' />
        <Button onClick={sendMessage} title='发送' />
        <Button onClick={closeRoom} title='关闭房间' />
      </div>
    </div>
  )
}

export default Id
