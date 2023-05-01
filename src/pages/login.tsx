import type { Component } from 'solid-js'
import { createSignal, onMount } from 'solid-js'
import { useNavigate } from '@solidjs/router'
import supabase from '../utils/supabase'
import Input from '~/components/ui/Input'
import Button from '~/components/ui/Button'

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
    <div class='flex flex-col items-center justify-center h-screen w-full'>
      <div class='w-80 h-70 flex flex-col justify-between border shadow-lg p-5 rounded-lg'>
        <Input label='邮箱' value={email()} setValue={setEmail} />
        <Input type='password' label='密码' value={password()} setValue={setPassword} />
        <div class='flex flex-col text-sm gap-1'>
          <Button title='登录' onClick={login} />
          <a class='text-primary' cursor-pointer onClick={() => { navigate('/register') }}>注册</a>
        </div>
      </div>
    </div>
  )
}

export default Login
