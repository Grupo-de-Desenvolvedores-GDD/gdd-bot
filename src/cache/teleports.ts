type PendingTeleport = {

    target: string
    expiresIn: number

}

const cache = new Map<string, PendingTeleport[]>()

export const get = (id: string) => cache.get(id) ?? []
export const add = (id: string, target: string) => get(id).push({ target, expiresIn: Date.now() + 600 })
export const remove = (id: string, target: string) => {
    const pending = get(id)
    return pending.splice(pending.findIndex(pending => pending.target === target), 1)
}

export const clearExpireds = () => setInterval(() => cache.forEach((value, key) => cache.set(key, value.filter(pending => pending.expiresIn > Date.now()))), 300000)