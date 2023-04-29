import type { Component } from 'solid-js'

interface ChatBubbleProps {
  username: string
  message: string
}

const ChatBubble: Component<ChatBubbleProps> = (props) => {
  return (
    <div class="px-3 hover:bg-gray-200 py-1 rounded text-sm of-hidden">
      <p class='font-bold'>{props.username}: <span class='font-normal break-all'>{props.message}</span>
      </p>

    </div>
  )
}

export default ChatBubble
