import * as firebase from 'firebase/app';
import { toStringMethods, pathToString, TypedPathKey, TypedPathFunction } from './utils'

type CleanUP = () => void;

interface Listener {
    off: CleanUP;
}

function listen<T = any>(path: string, cb: (d: T) => void): Listener {
    const ref = firebase.database().ref(path);
    if (cb) {
        ref.on("value", (snapshot: any) => cb(snapshot.val()))
    }
    return {
        off: () => ref.off('value'),
    }
}

async function getValue<T = any>(path: string): Promise<T> {
    const snapshot = firebase.database().ref(path).once('value', (snap: any) => snap)
    return (await snapshot).val()
}

export function typedRealTimeDB<T>(path: string[] = []): TypedRealTimeDB<T> {
    return <TypedRealTimeDB<T>>new Proxy({}, {
        get(target: T, name: TypedPathKey) {
            if (name === '$path') {
                return pathToString(path).split('.').join('/')
            }

            if (name === '$raw') {
                return path;
            }

            if (name === '$listen') {
                const route = pathToString(path).split('.').join('/')
                return (cb: any) => listen<T>(route, cb);
            }

            if (name === '$value') {
                const route = pathToString(path).split('.').join('/')
                return getValue(route);
            }

            if (name === '$ref') {
                const route = pathToString(path).split('.').join('/')
                return firebase.database().ref(route);
            }

            if (toStringMethods.includes(name)) {
                return () => pathToString(path);
            }

            return typedRealTimeDB([...path, name.toString()]);
        }
    });
}

type TypedPathNode<T> = {
    $path: string;
    $raw: TypedPathKey[];
    $listen: (cb: (d: T) => void) => Listener;
    $ref: firebase.database.Reference;
    $value: Promise<T>;
};

export type TypedRealTimeDB<T> = (T extends Array<infer Z>
    ? {
        [index: number]: TypedRealTimeDB<Z>;
    }
    : T extends TypedPathFunction<infer RET>
    ? {
        (): TypedRealTimeDB<RET>;
    } & {
        [P in keyof RET]: TypedRealTimeDB<RET[P]>;
    }
    : {
        [P in keyof T]: TypedRealTimeDB<T[P]>;
    }
) & TypedPathNode<T>;
