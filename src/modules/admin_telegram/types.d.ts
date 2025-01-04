import { Context, SessionFlavor } from "grammy"

export interface SessionData {
  updateContent?: KeyContentUpdate
}

interface MyContext extends Context, SessionFlavor<SessionData> {
}

export type WordContentUpdate = "someUpdate" | "обновить" | "обнови" | "update" | "email" | "почта" | "почту" | "телефон" | "phone"
export type KeyContentUpdate = "someUpdate" | "email" | "phone"

export interface KeyContentUpdateWord {
    key: KeyContentUpdate
    word: WordContentUpdate
}