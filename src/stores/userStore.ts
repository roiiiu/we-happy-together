import { createStore } from "solid-js/store";

const [userStore, setUserstore] = createStore
  ({
    username: "",
  })

const updateUserName = (username: string) => {
  setUserstore("username", username)
}

export { userStore, updateUserName }
