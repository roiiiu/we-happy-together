import { useNavigate } from "@solidjs/router";
import { Component, Show, createSignal } from "solid-js";
import RoomSettings from "./RoomSettings";
import { roomStore } from "~/stores/roomStore";


const RoomNav: Component = (props) => {
  const [settingsVisible, setSettingsVisible] = createSignal(false)
  const navigate = useNavigate()

  return (
    <div class='h-15 w-full flex items-center justify-between border-b px5'>
      <button onClick={() => {
        navigate('/', { replace: true })
      }} class='rounded px-3 py-2 transition-colors duration-300 hover:bg-gray-200'>
        <div class='i-carbon-arrow-left' />
      </button>
      <Show when={roomStore.isAdmin}>
        <button onClick={() => { setSettingsVisible(true) }} class='rounded px-3 py-2 transition-colors duration-300 hover:bg-gray-200'>
          <div class="i-carbon-settings" />
        </button>
      </Show>
      {/* Settings */}
      <Show when={settingsVisible()}>
        <RoomSettings setSettingsVisible={setSettingsVisible} />
      </Show>

    </div>
  )
}

export default RoomNav
