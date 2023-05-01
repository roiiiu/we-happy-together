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
    <div class="flex flex-col h-full justify-end ">
      <div class="flex flex-col p-3 b-t gap-2">
        <Input value={props.videoUrl} setValue={props.setVideoUrl} />
        <div class="flex justify-end">
          <Button onClick={props.playVideo} title='播放' class="w-20" />
        </div>
      </div>
    </div>

  )
}

export default SidePagePlaylist
