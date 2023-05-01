import { Component } from "solid-js";
import Button from "./ui/Button";
import Input from "./ui/Input";

interface Props {
  videoUrl: string
  setVideoUrl: (_: string) => void
  playVideo: () => void
}

const SidePagePlaylist: Component<Props> = (props) => {
  return (
    <div class="relative flex-1">
      <div class="absolute inset-0 flex flex-col">
        <div class="p-3 of-auto flex-1 min-h-0" />
        <div class="flex flex-col p-3 b-t gap-2">
          <Input value={props.videoUrl} setValue={props.setVideoUrl} />
          <div class="flex justify-end">
            <Button onClick={props.playVideo} title='播放' class="w-20" />
          </div>
        </div>
      </div>
    </div>

  )
}

export default SidePagePlaylist
