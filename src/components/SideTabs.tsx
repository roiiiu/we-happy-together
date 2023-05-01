import { Show } from "solid-js";
import type { Component } from 'solid-js'
import { roomStore } from "~/stores/roomStore";

interface Props {
  selectedTab: number
  setSelectedTab: (_: number) => void
}

const SideTabs: Component<Props> = (props) => {
  return (
    <div class='grid grid-cols-2 border-b py-2 text-center'>
      <button onClick={() => { props.setSelectedTab(0) }} class={`${props.selectedTab === 0 ? 'text-primary' : 'text-black'}`}>聊天</button>
      <Show when={roomStore.isAdmin}>
        <button onClick={() => { props.setSelectedTab(1) }} class={`b-l ${props.selectedTab === 1 ? 'text-primary' : 'text-black'}`}>播放列表</button>
      </Show>
    </div >
  )
}

export default SideTabs
