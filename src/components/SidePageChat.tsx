import { Component, For } from "solid-js";
import ChatBubble from "./ui/ChatBubble";
import { ChatMessage } from "~/types";
import ChatInput from "./ChatInput";

interface Props {
  messageList: ChatMessage[]
  sendMessage: (_: string) => Promise<void>
}

const SidePageChat: Component<Props> = (props) => {
  return (
    <div class="relative flex-1">
      <div class="absolute inset-0 flex flex-col">
        <div class='min-h-0 flex-1 of-auto p-3'>
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
