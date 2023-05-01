import { useNavigate, useParams } from '@solidjs/router'
import type { Component } from 'solid-js'
import { createSignal, onMount } from 'solid-js'
import Artplayer from 'artplayer'
import supabase from '../../utils/supabase'
import { AuthGuard } from '../../utils/auth'
import RoomSide from '~/components/RoomSide'
import RoomInfo from '~/components/RoomInfo'
import RoomNav from '~/components/RoomNav'
import { roomStore, updateRoom, updateRoomAdmin, updateRoomVideoUrl } from '~/stores/roomStore'
import { WatchRoom } from '~/types'

const Id: Component = () => {
  AuthGuard()
  const { id } = useParams<{ id: string }>()
  const channel = supabase.channel(id)
  const [username, setUsername] = createSignal('')
  const navigate = useNavigate()
  let art: Artplayer
  let userId: string
  let artRef: any

  onMount(async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user)
      return
    userId = userData.user.id

    const { data: roomData } = await supabase.from('WatchRoom').select('*').eq('room_id', id)
    if (!roomData || roomData.length === 0) {
      navigate('/', { replace: true })
      return
    }
    else {
      updateRoom(roomData[0] as WatchRoom)
      updateRoomAdmin(roomStore.room.owner === userId)
    }

    initPlayer()

    const { data: usernameData } = await supabase.from('Users').select('*').eq('user_id', userData.user.id)
    if (usernameData && usernameData.length > 0)
      setUsername(usernameData[0].username ?? '')
  })

  async function initPlayer() {
    art = new Artplayer({
      container: artRef,
      url: roomStore.room.video_url,
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
            !roomStore.isAdmin && asynchronous()
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
    },
      function onReady() {
        this.currentTime = roomStore.room.current_time
        roomStore.room.is_paused ? this.pause() : this.play()
      }
    )

    if (roomStore.isAdmin) {
      art.on('play', async () => {
        channel.send({
          type: 'broadcast',
          event: 'play',
          payload: '',
        })
        await supabase.from('WatchRoom').update({ is_paused: false }).eq('room_id', id)
      }
      )
      art.on('pause', async () => {
        channel.send({
          type: 'broadcast',
          event: 'pause',
          payload: '',
        })
        await supabase.from('WatchRoom').update({ is_paused: true }).eq('room_id', id)
      })
      art.on('seek', () => {
        channel.send({
          type: 'broadcast',
          event: 'seeked',
          payload: art.currentTime,
        })
      })
      art.on('video:timeupdate', async () => {
        await supabase.from('WatchRoom').update({ current_time: art.currentTime }).eq('room_id', id)
      })
    }
  }

  channel.on('broadcast', { event: 'play' }, () => {
    art.play()
  }).on('broadcast', { event: 'pause' }, () => {
    art.pause()
  }).on('broadcast', { event: 'seeked' }, (payload) => {
    art.currentTime = payload.payload
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
        table: 'WatchRoom',
        filter: `room_id=eq.${id}`,
      },
      (payload) => {
        if (!art.url.includes(payload.new.video_url)) {
          updateRoomVideoUrl(payload.new.video_url)
          art.url = payload.new.video_url
          art.play()
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
    await supabase.from('WatchRoom').delete().eq('room_id', id)
    navigate('/', { replace: true })
  }

  async function asynchronous() {
    const { data } = await supabase.from('WatchRoom').select('*').eq('room_id', id)
    if (data && data.length > 0) {
      art.currentTime = data[0].current_time + 0.4
      if (!art.playing && !data[0].is_paused) {
        art.play()
      }
    }
  }

  async function playVideo() {
    await supabase.from('WatchRoom').update({ video_url: roomStore.room.video_url }).eq('room_id', id)
  }

  return (
    <div class='h-full w-full flex flex-col'>
      <RoomNav />
      <div class='h-full flex flex-1 flex-col md:flex-row'>
        <div class='flex flex-1 flex-col'>
          {/* Player */}
          <div ref={artRef} class='aspect-ratio-video h-auto w-full object-contain' />
          <RoomInfo />
        </div>
        {/* Chat */}
        <RoomSide
          playVideo={playVideo}
          username={username()}
          channel={channel}
        />
      </div>
    </div>
  )
}

export default Id
