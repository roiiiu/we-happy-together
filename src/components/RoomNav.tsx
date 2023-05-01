import { useNavigate } from "@solidjs/router";
import { Component, Show, createEffect, createSignal } from "solid-js";
import Input from "./ui/Input";
import Switch from "./ui/Switch";
import { Portal } from "solid-js/web";
import RoomSettings from "./RoomSettings";
import { roomStore } from "~/stores/roomStore";


const RoomNav: Component = (props) => {
  const [settingsVisible, setSettingsVisible] = createSignal(false)
  const navigate = useNavigate()

  return (
    <div class='h-15 w-full flex justify-between items-center border-b px5'>
      <button onClick={() => {
        navigate('/', { replace: true })
      }} class='px-3 py-2 hover:bg-gray-200 transition-colors duration-300 rounded'>
        <div class='i-carbon-arrow-left' />
      </button>
      <Show when={roomStore.isAdmin}>
        <button onClick={() => { setSettingsVisible(true) }} class='px-3 py-2 hover:bg-gray-200 transition-colors duration-300 rounded'>
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
