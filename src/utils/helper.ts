import path from "path"

export const getPathToApp = () => {
    return path.resolve(__dirname, "..", "..", "..", "app")
}