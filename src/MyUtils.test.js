import MyUtils from "./MyUtils";

test('copy test', () => {
    const a = [1,2,3]
    const b = (new MyUtils()).copy(a)
    a[0] = 0
    expect(b).toStrictEqual([1,2,3])
});

test('range test', () => {
    const b = (new MyUtils()).range(5)
    expect(b).toStrictEqual([0,1,2,3,4])
});
