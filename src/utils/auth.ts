import { useNavigate } from '@solidjs/router'
import { onMount } from 'solid-js'
import supabase from './supabase'

export function AuthGuard() {
  const navigate = useNavigate()
  onMount(async () => {
    const auth = await supabase.auth.getSession()
    if (!auth.data.session)
      navigate('/login', { replace: true })
  })
}
