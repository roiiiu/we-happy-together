import { useNavigate, useParams } from '@solidjs/router'
import type { Component } from 'solid-js'
import { onMount } from 'solid-js'
import Artplayer from 'artplayer'
import supabase from '../../utils/supabase'
import { AuthGuard } from '../../utils/auth'
import RoomSide from '~/components/RoomSide'
import RoomInfo from '~/components/RoomInfo'
import RoomNav from '~/components/RoomNav'
import { roomStore, updateRoom, updateRoomAdmin, updateRoomVideoUrl } from '~/stores/roomStore'
import { WatchRoom } from '~/types'
import { updateUserName } from '~/stores/userStore'
import Hls from 'hls.js'

const Id: Component = () => {
  AuthGuard()
  const { id } = useParams<{ id: string }>()
  const channel = supabase.channel(id)
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
      updateUserName(usernameData[0].username ?? '')
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
      type: "m3u8",
      customType: {
        m3u8: function (video: HTMLMediaElement, url: string) {
          const hls = new Hls()
          hls.loadSource(url)
          hls.attachMedia(video)
          if (!video.src) {
            video.src = url
          }
        },
      },
      controls: [
        {
          position: 'right',
          html: '<div i-carbon-renew></div>',
          tooltip: !roomStore.isAdmin ? '同步' : '同步观众进度',
          click: function (...args) {
            if (!roomStore.isAdmin)
              asynchronous()
            else
              channel.send({
                type: 'broadcast',
                event: 'seeked',
                payload: this.currentTime,
              })
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
  }).on('broadcast', { event: 'change-video' }, (payload) => {
    if (!art.url.includes(payload.payload)) {
      art.url = payload.payload
      updateRoomVideoUrl(payload.payload)
      art.play()
    }
  })
    .on('presence', { event: 'join' }, async ({ newPresences }) => {
    })
    .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
    })
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

  async function playVideo(url: string) {
    art.url = url
    await supabase.from('WatchRoom').update({ video_url: url }).eq('room_id', id)
    channel.send({
      type: 'broadcast',
      event: 'change-video',
      payload: url,
    })
    updateRoomVideoUrl(url)
    art.play()
  }

  return (
    <div class='h-full w-full flex flex-col'>
      <RoomNav />
      <div class='h-full flex flex-1 flex-col md:flex-row'>
        <div class='flex flex-1 flex-col'>
          {/* Player */}
          <div ref={artRef} class='aspect-ratio-video h-auto max-h-3xl w-full object-contain' />
          <RoomInfo />
        </div>
        {/* Chat */}
        <RoomSide
          playVideo={playVideo}
          channel={channel}
        />
      </div>
    </div>
  )
}

export default Id
