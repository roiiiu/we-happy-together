import { useNavigate, useParams } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createSignal, onMount } from 'solid-js'
import Artplayer from 'artplayer'
import supabase from '../../utils/supabase'
import { AuthGuard } from '../../utils/auth'
import RoomSide from '~/components/RoomSide'
import RoomInfo from '~/components/RoomInfo'
import RoomNav from '~/components/RoomNav'

const Id: Component = () => {
  AuthGuard()
  const { id } = useParams<{ id: string }>()
  const channel = supabase.channel(id)
  const [isAdmin, setIsAdmin] = createSignal(false)
  const [message, setMessage] = createSignal('')
  const [videoUrl, setVideoUrl] = createSignal('')
  const [username, setUsername] = createSignal('')
  const [onlineUsers, setOnlineUsers] = createSignal<string[]>([])
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
    const { data: usernameData } = await supabase.from('Users').select('*').eq('user_id', userData.user.id)
    if (usernameData && usernameData.length > 0)
      setUsername(usernameData[0].username ?? '')

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
      setting: true,
      loop: true,
      flip: true,
      controls: [

        {
          position: 'right',
          html: '<div i-carbon-renew></div>',
          tooltip: '同步',
          click: function (...args) {
            !isAdmin() && asynchronous()
          },
        }
      ],
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

  channel.on('broadcast', { event: 'play' }, () => {
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

  async function closeRoom() {
    channel.send({
      type: 'broadcast',
      event: 'close-room',
      payload: '',
    })
    await supabase.from('Auditorium').delete().eq('room_id', id)
    navigate('/', { replace: true })
  }

  async function asynchronous() {
    const { data } = await supabase.from('Auditorium').select('*').eq('room_id', id)
    if (data && data.length > 0) {
      player.currentTime = data[0].current_time + 0.4
      console.log(data[0].is_paused, player.playing);
      if (!player.playing && !data[0].is_paused) {
        player.play()
      }
    }
  }

  async function playVideo() {
    if (!videoUrl())
      return
    await supabase.from('Auditorium').update({ video_url: videoUrl() }).eq('room_id', id)
  }

  return (
    <div class='h-full w-full flex flex-col'>
      <RoomNav isAdmin={isAdmin()} roomId={id} />
      <div class='flex flex-1 flex-col h-full md:flex-row'>
        <div class='flex-1 flex flex-col'>
          {/* Player */}
          <div id="art-player" class='w-full h-auto aspect-ratio-video object-contain' />
          <RoomInfo id={id} />
        </div>
        {/* Chat */}
        <RoomSide
          isAdmin={isAdmin()}
          videoUrl={videoUrl()}
          setVideoUrl={setVideoUrl}
          playVideo={playVideo}
          username={username()}
          channel={channel}
        />
      </div>
    </div>
  )
}

export default Id
