"use client"

import { dictType } from "@/app/dictionaries/dictionariesClientSide"
import React from "react"


/**
 * https://github.com/vercel/next.js/discussions/57405 
 * */
const DictionaryContext = React.createContext<dictType | null>(null)

export default function DictProvider({
  dict,
  children,
}: {
  dict: dictType
  children: React.ReactNode
}) {
  return (
    <DictionaryContext.Provider value={dict}>
      {children}
    </DictionaryContext.Provider>
  )
}

export function useDictionary() {
  const dictionary = React.useContext(DictionaryContext)
  if (dictionary === null) {
    throw new Error('useDictionary hook must be used within DictionaryProvider')
  }

  return dictionary
}