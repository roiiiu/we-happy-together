import { Component, For, createSignal } from "solid-js";
import ChatBubble from "./ui/ChatBubble";
import { ChatMessage } from "~/types";
import ChatInput from "./ChatInput";
import { RealtimeChannel } from "@supabase/supabase-js";

interface Props {
  messageList: ChatMessage[]
  sendMessage: (_: string) => void
}

const SidePageChat: Component<Props> = (props) => {




  return (
    <div class="relative flex-1">
      <div class="absolute inset-0 flex flex-col">
        <div class='p-3 of-auto flex-1 min-h-0'>
          <For each={props.messageList}>
            {message => (
              <ChatBubble username={message.username} message={message.message} />
            )}
          </For>
        </div>
        <ChatInput sendMessage={props.sendMessage} />
      </div>
    </div>

  )
}

export default SidePageChat
