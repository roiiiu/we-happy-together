import { Component } from "solid-js";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { roomStore, updateRoomVideoUrl } from "~/stores/roomStore";

interface Props {
  playVideo: () => void
}

const SidePagePlaylist: Component<Props> = (props) => {
  return (
    <div class="relative flex-1">
      <div class="absolute inset-0 flex flex-col">
        <div class="min-h-0 flex-1 of-auto p-3" />
        <div class="flex flex-col gap-2 b-t p-3">
          <Input value={roomStore.room.video_url} setValue={updateRoomVideoUrl} />
          <div class="flex justify-end">
            <Button onClick={props.playVideo} title='播放' class="w-20" />
          </div>
        </div>
      </div>
    </div>

  )
}

export default SidePagePlaylist
