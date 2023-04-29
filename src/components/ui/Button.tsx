import type { Component } from 'solid-js'

interface ButtonProps {
  title: string
  onClick?: () => void
  class?: string
}

const Button: Component<ButtonProps> = (props) => {
  return (
    <button onClick={props.onClick} class={`text-text bg-primary h-10 font-bold border rounded px-2 ${props.class}`}>{props.title}</button>
  )
}

export default Button
