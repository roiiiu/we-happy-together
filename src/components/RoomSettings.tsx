import { Component, Show, createSignal, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import Input from "./ui/Input";
import Switch from "./ui/Switch";
import supabase from "~/utils/supabase";
import Button from "./ui/Button";
import { roomStore, updateRoomDescription, updateRoomName, updateRoomPublic } from "~/stores/roomStore";

interface Props {
  setSettingsVisible: (visible: boolean) => void
  onCloseRoom: () => void
}

const RoomSettings: Component<Props> = (props) => {
  const [roomName, setRoomName] = createSignal(roomStore.room.room_name ?? '')
  const [roomDescrition, setRoomDescrition] = createSignal(roomStore.room.description ?? '')
  const [isPublic, setIsPublic] = createSignal(roomStore.room.is_public ?? false)


  async function onSave() {
    const { error } = await supabase.from('WatchRoom').update({
      is_public: isPublic(),
      room_name: roomName(),
      description: roomDescrition()
    }).eq('room_id', roomStore.room.room_id)

    if (!error) {
      updateRoomPublic(isPublic())
      updateRoomName(roomName())
      updateRoomDescription(roomDescrition())
      props.setSettingsVisible(false)
    }
  }

  return (
    <Portal>
      <div class="absolute inset-0 z-99 flex items-center justify-center bg-black bg-op-40 p-5" onClick={() => { props.setSettingsVisible(false) }}>
        <div class="mx-auto w-100 max-w-screen-xl rounded bg-white p-5 space-y-5"
          onClick={(e) => { e.stopPropagation() }}
        >
          <div class="flex items-center justify-between">
            <p class="text-lg font-bold">房间设置</p>
            <button
              onClick={() => { props.setSettingsVisible(false) }}
              class="rounded p-2 transition-colors duration-300 hover:bg-gray-200">
              <div class="i-carbon-close" />
            </button>
          </div>
          <Input label="房间名" value={roomName()} setValue={setRoomName} />
          <Input label="房间信息" value={roomDescrition()} setValue={setRoomDescrition} />
          <div class="flex items-center justify-between">
            <p class="text-sm">公开放映厅</p>
            <Switch checked={isPublic()} onChange={checked => setIsPublic(checked)} />
          </div>
          <div class="w-full flex justify-between pt-5">
            <Button title="关闭放映厅" class="bg-important hover:bg-important-deep" onClick={props.onCloseRoom} />
            <Button title="保存" class="bg-primary hover:bg-primary-deep" onClick={() => { onSave() }} />
          </div>
        </div>
      </div>
    </Portal>
  )
}

export default RoomSettings;
