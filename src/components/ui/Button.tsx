import type { Component } from 'solid-js'

interface ButtonProps {
  title: string
  onClick?: () => void
  class?: string
  type?: 'submit' | 'button'
}

const Button: Component<ButtonProps> = (props) => {
  return (
    <button type={props.type} onClick={props.onClick} class={`text-text hover:bg-primary-deep transition-colors duration-300 bg-primary h-10 font-bold border rounded px-2 ${props.class}`}>{props.title}</button>
  )
}

export default Button
