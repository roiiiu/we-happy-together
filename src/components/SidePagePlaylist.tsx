import { Component, For, Match, Show, Switch, createSignal } from "solid-js";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { roomStore, updateRoomVideoUrl } from "~/stores/roomStore";
import { Content } from "~/types";

interface Props {
  playVideo: (url: string) => Promise<void>
  checkDicOrFile: (path: Content) => Promise<void>
  list: Content[]
  hasParent: boolean
  onNavBack: () => void
}

const SidePagePlaylist: Component<Props> = (props) => {

  const [url, setUrl] = createSignal(roomStore.room.video_url)

  return (
    <div class="relative flex-1">
      <div class="absolute inset-0 flex flex-col">
        <div class="min-h-0 flex-1 of-auto p-3" >
          <Show when={props.hasParent} fallback={
            <div class="mb-2 block px-3 text-start text-sm text-primary">目录</div>
          }>
            <button onClick={props.onNavBack} class="block w-full rounded px-3 py-1 text-start text-sm text-primary">上一级</button>
          </Show>
          <For each={props.list}>
            {(item, idx) => (
              <button onClick={() => { props.checkDicOrFile(item) }} class="block w-full flex items-center gap-2 of-hidden truncate rounded px-3 py-1 text-start text-sm hover:bg-gray-200">
                <Switch>
                  <Match when={item.is_dir}>
                    <span class="i-carbon-folder text-primary" />
                  </Match>
                  <Match when={item.type === 2}>
                    <span class="i-carbon-video text-primary" />
                  </Match>
                </Switch>
                {item.name}
              </button>
            )}
          </For>
        </div>
        {/* <div class="flex flex-col gap-2 b-t p-3">
          <Input value={(url())} setValue={setUrl} />
          <div class="flex justify-end">
            <Button onClick={() => { props.playVideo(url()) }} title='播放' class="w-20" />
          </div>
        </div> */}
      </div>
    </div>

  )
}

export default SidePagePlaylist
