import type { Component } from 'solid-js'
import { createSignal, onMount } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import supabase from '../utils/supabase'

const Login: Component = () => {
  const [email, setEmail] = createSignal('')
  const [password, setPassword] = createSignal('')
  const navigate = useNavigate()

  onMount(async () => {
    const session = await supabase.auth.getSession()
    if (session.data.session)
      navigate('/', { replace: true })
  })

  async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email(),
      password: password(),
    })
    if (!error)
      navigate('/', { replace: true })
  }

  return (
  <div class='flex flex-col items-center justify-center'>
    <input class='border' value={email()} onChange={(e) => { setEmail(e.target.value) }}/>
    <input class='border' value={password()} onChange={(e) => { setPassword(e.target.value) }}/>
    <button onClick={login}>Login</button>
  </div>
  )
}

export default Login
