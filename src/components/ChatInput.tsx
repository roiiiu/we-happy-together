import type { Component } from 'solid-js'

interface ChatInputProps {
  value: string
  setValue: (value: string) => void
}

const ChatInput: Component<ChatInputProps> = (props) => {
  return (
    <input class='outline-primary w-full border rounded outline-2 p-2' value={props.value} onChange={(e) => { props.setValue(e.target.value) }} />
  )
}

export default ChatInput
