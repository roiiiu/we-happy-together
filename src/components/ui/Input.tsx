import type { Component } from 'solid-js'
import { Show } from 'solid-js'

interface InputProps {
  value: string
  setValue: (value: string) => void
  label?: string
  type?: 'text' | 'password'
}

const Input: Component<InputProps> = (props) => {
  return (
    <div class='flex flex-col justify-start'>
      <Show when={props.label}>
        <p class='text-sm op60'>{props.label}</p>
      </Show>
      <input type={props.type} class='border outline-primary rounded outline-2 h-10 px-2' value={props.value} onChange={(e) => { props.setValue(e.target.value) }} />
    </div>
  )
}

export default Input
