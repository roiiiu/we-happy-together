import type { Component } from 'solid-js'
import { createSignal } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import Button from '../components/Button'
import { AuthGuard } from '../utils/auth'
import supabase from '../utils/supabase'

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
      .from('Auditorium')
      .insert([
        { room_id: roomId(), owner: res.user.id, is_public: true },
      ])

    if (error)
      return

    navigate(`/room/${roomId()}`)
  }

  async function joinRoom() {
    const { data, error } = await supabase.from('Auditorium').select('*').eq('room_id', joinRoomId())

    if (data && data.length > 0)
      navigate(`/room/${joinRoomId()}`)
    else
      alert('房间不存在')
  }

  return (
    <div class='flex flex-col h-screen w-full items-center justify-center'>
      <input class='border' value={roomId()} onChange={(e) => { setRoomId(e.target.value) }}/>
      <Button onClick={createRoom} title={'创建房间'}/>
      <input class='border' value={joinRoomId()} onChange={(e) => { setJoinRoomId(e.target.value) }}/>
      <Button onClick={joinRoom} title={'加入房间'}/>
      <Button onClick={logout} title={'登出'}/>
    </div>
  )
}

export default Index
