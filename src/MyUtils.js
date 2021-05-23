export function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function range(N) {
    return [...Array(N).keys()]
}


