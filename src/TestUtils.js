
export const almostEqual = (expected,result,delta) => {
    expect(Math.abs(expected-result)).not.toBeGreaterThan(delta)
    expect(Math.abs(expected-result)).not.toBeGreaterThan(-delta)
}

export const almostEqualArray = (expected,result, delta) => {
    for (let i = 0; i < expected.length; i++) {
        almostEqual(expected,result,delta)
    }
}