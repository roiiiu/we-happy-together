import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import Button from '../components/ui/Button'
import { AuthGuard } from '../utils/auth'
import supabase from '../utils/supabase'
import Input from '~/components/ui/Input'

const Index: Component = () => {
  AuthGuard()
  const navigate = useNavigate()
  const [roomId, setRoomId] = createSignal('')
  const [joinRoomId, setJoinRoomId] = createSignal('')

  async function logout() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  async function createRoom() {
    if (!roomId())
      return
    const res = (await supabase.auth.getUser()).data
    if (!res.user)
      return

    const { data, error } = await supabase
      .from('WatchRoom')
      .insert([
        {
          room_id: roomId(),
          owner: res.user.id,
          is_public: true,
          is_paused: false,
          room_name: '放映厅' + roomId(),
          description: '这是一个放映厅',
        },
      ])
    if (error)
      return

    navigate(`/room/${roomId()}`)
  }

  async function joinRoom() {
    const { data, error } = await supabase.from('WatchRoom').select('*').eq('room_id', joinRoomId())
    if (data && data.length > 0)
      navigate(`/room/${joinRoomId()}`)
    else {
      alert('房间不存在')
    }
  }

  return (
    <div class='h-screen w-full flex items-center justify-center'>
      <div class='h-90 w-80 flex flex-col justify-between border rounded-lg p-5 shadow-lg'>
        <Input label='房间id' value={roomId()} setValue={setRoomId} />
        <Button onClick={createRoom} title={'创建房间'} class='bg-primary hover:bg-primary-deep' />
        <Input label='房间id' value={joinRoomId()} setValue={setJoinRoomId} />
        <Button onClick={joinRoom} title={'加入房间'} class='bg-primary hover:bg-primary-deep' />
        <Button onClick={logout} title={'登出'} class='bg-primary hover:bg-primary-deep' />
      </div>
    </div>
  )
}

export default Index
