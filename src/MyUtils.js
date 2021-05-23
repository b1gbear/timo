class MyUtils {
    copy = obj => {
        return JSON.parse(JSON.stringify(obj));
    }

    range = (N) => {
        return [...Array(N).keys()]
    }
}

export default MyUtils


