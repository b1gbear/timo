import * as MyUtils from "./MyUtils";

test('copy test', () => {
    const a = [1,2,3]
    const b = MyUtils.copy(a)
    a[0] = 0
    expect(b).toStrictEqual([1,2,3])
});

test('range test', () => {
    const b = MyUtils.range(5)
    expect(b).toStrictEqual([0,1,2,3,4])
});

test('range test for A and B', () => {
    const b = MyUtils.range(1,5)
    expect(b).toStrictEqual([1,2,3,4])
});
