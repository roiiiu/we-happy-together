import { Component, Show, createSignal, onMount } from "solid-js";
import { Portal } from "solid-js/web";
import Input from "./ui/Input";
import Switch from "./ui/Switch";
import supabase from "~/utils/supabase";
import Button from "./ui/Button";

interface Props {
  setSettingsVisible: (visible: boolean) => void
  roomId: string
}

const RoomSettings: Component<Props> = (props) => {
  const [roomName, setRoomName] = createSignal('')
  const [isPublic, setIsPublic] = createSignal(false)

  onMount(async () => {
    await supabase.from('Auditorium').select('*').eq('room_id', props.roomId).then(({ data }) => {
      if (data && data.length > 0) {
        setRoomName(data[0].room_name ?? '')
        setIsPublic(data[0].is_public ?? false)
      }
    })
  })

  async function handleSave() {
    await supabase.from('Auditorium').update({
      is_public: isPublic(),
      room_name: roomName()
    }).eq('room_id', props.roomId)
    props.setSettingsVisible(false)
  }

  return (
    <Portal>
      <div class="z-99 bg-black p-5 absolute inset-0 bg-op-40 flex items-center justify-center" onClick={() => { props.setSettingsVisible(false) }}>
        <div class="max-w-screen-xl mx-auto w-100 bg-white rounded p-5 space-y-5"
          onClick={(e) => { e.stopPropagation() }}
        >
          <div class="flex justify-between items-center">
            <p class="font-bold text-lg">房间设置</p>
            <button
              onClick={() => { props.setSettingsVisible(false) }}
              class="p-2 hover:bg-gray-200 transition-colors duration-300 rounded">
              <div class="i-carbon-close" />
            </button>
          </div>
          <Input label="房间名" value={roomName()} setValue={setRoomName} />
          <div class="flex items-center justify-between">
            <p class="text-sm">公开放映厅</p>
            <Switch checked={isPublic()} onChange={checked => setIsPublic(checked)} />
          </div>
          <div class="flex w-full justify-end pt-5">
            <Button title="保存" class="h-7 rounded" onClick={() => { handleSave() }} />
          </div>
        </div>
      </div>
    </Portal>
  )
}

export default RoomSettings;
