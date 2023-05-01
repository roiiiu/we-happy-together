import { Component, For, createSignal } from "solid-js";
import ChatBubble from "./ui/ChatBubble";
import { ChatMessage } from "~/types";
import ChatInput from "./ChatInput";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Props {
  channel: RealtimeChannel
  username: string
}

const SidePageChat: Component<Props> = (props) => {
  const [messageList, setMessageList] = createSignal<ChatMessage[]>([])

  props.channel
    .on('broadcast', { event: 'chat-message' }, (payload) => {
      setMessageList(pre => [...pre, payload.payload])
    })

  async function sendMessage(message: string) {
    if (!message)
      return
    await props.channel.send({
      type: 'broadcast',
      event: 'chat-message',
      payload: {
        username: props.username,
        message: message,
      },
    })
    setMessageList(pre => [...pre,
    {
      username: props.username,
      message: message,
    },
    ])
  }
  return (
    <div class="flex flex-col h-full">
      <div class='flex flex-col flex-1 of-y-auto p-3'>
        <For each={messageList()}>
          {message => (
            <ChatBubble username={message.username} message={message.message} />
          )}
        </For>
      </div>
      <ChatInput sendMessage={sendMessage} />
    </div>

  )
}

export default SidePageChat
