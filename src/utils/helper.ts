import path from "path"

export const getPathToStorage = () => {
    return path.resolve(__dirname, "..", "..", "..", "storage")
}