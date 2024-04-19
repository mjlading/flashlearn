import {getDictionary}from "./dictionaries"

export type dictType = Awaited<ReturnType<typeof getDictionary>>
