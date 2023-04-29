import type { Component } from 'solid-js'

interface AudienceProps {
  username: string
}

const Audience: Component<AudienceProps> = (props) => {
  return (
    <div class='rounded-full p-2 bg-primary w-10 h-10 text-center text-text shadow border'>
      <h1>{props.username.slice(0, 1)}</h1>
    </div>
  )
}

export default Audience
