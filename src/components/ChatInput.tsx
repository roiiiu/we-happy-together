import { Component, createSignal } from 'solid-js'
import Button from './ui/Button'
import Input from './ui/Input'
import { RealtimeChannel } from '@supabase/supabase-js'

interface ChatInputProps {
  sendMessage: (value: string) => Promise<void>
}

const ChatForm: Component<ChatInputProps> = (props) => {
  const [message, setMessage] = createSignal('')

  return (
    <form onSubmit={async (e) => {
      e.preventDefault()
      await props.sendMessage(message())
      setMessage('')
    }} class='flex flex-col gap-2 p-3 b-t'>
      <Input value={message()} setValue={setMessage} />
      <div class='flex justify-end'>
        <Button type='submit' title='发送' class='w-20' />
      </div>
    </form>
  )
}

export default ChatForm
