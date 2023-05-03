import { useNavigate } from '@solidjs/router'
import { Component } from 'solid-js'
import { createSignal } from 'solid-js'
import Button from '~/components/ui/Button'
import Input from '~/components/ui/Input'
import supabase from '~/utils/supabase'

const Register: Component = () => {
  const [email, setEmail] = createSignal('')
  const [username, serUsername] = createSignal('')
  const [password, setPassword] = createSignal('')
  const [passwordConfirm, setPasswordConfirm] = createSignal('')
  const navigate = useNavigate()

  async function register() {
    if (password() !== passwordConfirm())
      return
    const { data, error } = await supabase.auth.signUp({
      email: email(),
      password: password(),
    })
    if (!error) {
      await supabase.from('Users').insert([{ username: username(), user_id: data?.user?.id }])
      navigate('/login', { replace: true })
    }
  }

  return (
    <div
      class='relative h-screen w-full flex items-center justify-center' >
      <div
        class='absolute h-100 w-80 flex flex-col justify-between border rounded-lg p-5 shadow-lg' >
        <Input label='邮箱' value={email()} setValue={setEmail} />
        <Input label='用户名' value={username()} setValue={serUsername} />
        <Input type='password' label='密码' value={password()} setValue={setPassword} />
        <Input type='password' label='确认密码' value={passwordConfirm()} setValue={setPasswordConfirm} />
        <div class='flex flex-col gap-1 text-sm'>
          <Button title="注册" onClick={register} class='bg-primary hover:bg-primary-deep' />
          <a class='text-primary' cursor-pointer onClick={() => { navigate('/login') }}>登录</a>
        </div>
      </div>
    </div >
  )
}

export default Register
