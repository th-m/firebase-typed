import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { toStringMethods, pathToString, TypedPathKey, TypedPathFunction } from './utils'
const to = <T>(promise: Promise<T>) => {
    return promise.then(data => [null, data]).catch(err => {
        console.error(err)
        return [err]
    });
};


const too = <T = any[]>(promises: Promise<T>[]) => {
    return Promise.all(promises).then(sources => [null, sources]).catch(err => {
        console.error(err)
        return [err]
    });
};

async function getValue<T = any>(path: string) {
    const ref = admin.database().ref(path).once('value', snap => snap);
    const [err, data] = await to(ref)
    if (err) {
        console.error({ path, err, data })
        return null
    }
    const d: T = data.val();
    return d
}

async function getValues<T = any[]>(paths: string[]) {
    const refs = paths.map(path => admin.database().ref(path).once('value', snap => snap))
    const [err, data] = await too(refs)
    if (err) {
        console.error({ paths, err, data })
        return null
    }
    const d: T = data.map((res: any) => res.val())
    return d
}

async function setValue<T = any>(path: string, data: T) {
    // return admin.database().ref(path).set(data).then(() => console.log(`\n\n set: ${Object.keys(data)?.[0] ?? data}  \n path: ${path} `))
    return admin.database().ref(path).set(data).then()
}

export function typedAdminDB<T>(path: string[] = []): TypedAdminDB<T> {
    const toRoute = (s: string) => {
        return s.split(",").join("/")
    }

    return <TypedAdminDB<T>>new Proxy({}, {
        get(target: T, name: TypedPathKey) {
            const route = toRoute(path.toString())
            if (name === '$path') {
                return route
            }

            if (name === '$raw') {
                return path;
            }

            if (name === '$set') {
                return (data: any) => setValue<T>(route, data)
            }

            if (name === '$ref') {
                // functions.database.ref('/games/{gameKey}/status')
                return () => functions.database.ref(route)
            }

            if (name === '$value') {
                return () => getValue<T>(route)
            }

            if (toStringMethods.includes(name)) {
                return () => pathToString(path);
            }

            return typedAdminDB([...path, name.toString()]);
        }
    });
}

// type TypedPathKey = string | symbol | number;

type TypedPathNode<T> = {
    $path: string;
    $raw: TypedPathKey[];
    $set: (path: T) => Promise<void>;
    $ref: () => functions.database.RefBuilder;
    $value: () => Promise<T>;
};

// type TypedPathFunction<T> = (...args: any[]) => T;

export type TypedAdminDB<T> = (
    T extends Array<infer Z>
    ? { [index: number]: TypedAdminDB<Z>; }
    : T extends TypedPathFunction<infer RET>
    ? { (): TypedAdminDB<RET>; } & { [P in keyof RET]: TypedAdminDB<RET[P]>; }
    : { [P in keyof T]: TypedAdminDB<T[P]>; }
) & TypedPathNode<T>;