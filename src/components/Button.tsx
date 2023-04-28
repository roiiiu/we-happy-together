import type { Component } from 'solid-js'

interface ButtonProps {
  title: string
  onClick?: () => void
}

const Button: Component<ButtonProps> = (props) => {
  return (
    <button onClick={props.onClick} class="text-red border rounded px-2">{props.title}</button>
  )
}

export default Button
