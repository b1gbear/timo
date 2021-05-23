
const createRange = function(a, b, step){
    var A = [];
    if(typeof a == 'number'){
        A[0] = a;
        step = step || 1;
        while(a+step <= b){
            A[A.length]= a+= step;
        }
    }
    else {
        var s = 'abcdefghijklmnopqrstuvwxyz';
        if(a === a.toUpperCase()){
            b = b.toUpperCase();
            s = s.toUpperCase();
        }
        s = s.substring(s.indexOf(a), s.indexOf(b)+ 1);
        A = s.split('');
    }
    return A;
}


export function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
}

export function range(A,B) {
    if ( B === undefined) {
        return createRange(0,A-1,1)
    } else {
        return createRange(A,B-1,1)
    }
}

