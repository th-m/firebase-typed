export const toStringMethods: (string | symbol | number)[] = [
    'toString',
    Symbol.toStringTag,
    'valueOf'
];

export function pathToString(path: string[]): string {
    return path.reduce((current, next) => {
        let curr = current
        if (+next === +next) {
            curr += `[${next}]`;
        } else {
            curr += current === '' ? `${next}` : `.${next}`;
        }

        return curr;
    }, '');
}


export type TypedPathKey = string | symbol | number;

export type TypedPathFunction<T> = (...args: any[]) => T;