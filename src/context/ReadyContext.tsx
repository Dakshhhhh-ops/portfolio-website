import { createContext, useContext } from 'react'

/** True once the preloader has started lifting, so intro animations can play underneath it. */
export const ReadyContext = createContext(true)

export const useReady = () => useContext(ReadyContext)
