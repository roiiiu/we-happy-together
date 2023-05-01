import gsap from 'gsap';
import { createEffect, onMount } from 'solid-js';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Switch = (props: SwitchProps) => {
  const tl = gsap.timeline({ paused: true, ease: 'linear' })
  let bgRef: any;
  let toggleRef: any

  return (
    <label
      ref={bgRef}
      onClick={() => {
        props.onChange(!props.checked)
      }}
      class={`rounded-full w-10 h-5 border flex relative items-center ${props.checked ? 'bg-primary' : 'bg-gray-200 '}`} >
      <label
        ref={toggleRef}
        class={`rounded-full h-3.5 w-3.5 absolute bg-white ${props.checked ? 'right-0.5' : 'left-0.5'
          }`} />
    </label>
  )
}

export default Switch;
