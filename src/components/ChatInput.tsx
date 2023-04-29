import type { Component } from 'solid-js'

interface ChatInputProps {
  value: string
  setValue: (value: string) => void
}

const ChatInput: Component<ChatInputProps> = (props) => {
  return (
    <textarea class='outline-primary resize-none border rounded outline-2 h-20 p-2' value={props.value} onChange={(e) => { props.setValue(e.target.value) }} />
  )
}

export default ChatInput
