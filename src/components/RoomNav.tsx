import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";

const RoomNav: Component = () => {

  const navigate = useNavigate()

  return (
    <div class='h-15 w-full flex justify-between items-center border-b px5'>
      <button onClick={() => {
        navigate('/', { replace: true })
      }} class='px-3 py-2 hover:bg-gray-200 transition-colors duration-300 rounded'>
        <div class='i-carbon-arrow-left' />
      </button>
    </div>
  )
}

export default RoomNav
