import { Motion } from "@motionone/solid";

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Switch = (props: SwitchProps) => {
  return (
    <Motion.button
      animate={{ backgroundColor: props.checked ? '#FF9000' : 'rgb(229,231,225)' }}
      onClick={() => { props.onChange(!props.checked) }}
      class="rounded-full w-10 h-5 border flex relative bg-gray-200 items-center" >
      <Motion.button
        animate={{
          left: props.checked ? 'calc(100% - 1.125rem)' : '0.125rem',
        }}
        transition={{
          duration: 0.2,
        }}
        class={`rounded-full h-4 w-4 absolute left-0.5 bg-white transition-all`} />
    </Motion.button>
  )
}

export default Switch;
