# firebase-typed
Typescript utility for firebase. Provides intellisense and type safety for realtime db and firestore methods and documents.


## Usage

All you need to create a typed instance of your db is an defined interface. For the purposes of this document our example interface will be:

```
export interface Game {
    host: Player,
    characters: Character,
    players: Players,
    playersActions: PlayersActions,
    status: GameStatus,
    ...
}

```
### Import
```
import { typedRealTimeDB, TypedRealTimeDB } from 'firebase-typed';

const db = typedRealTimeDB<Game>()
```

## Example

For reference the interface demoed looks like this 


![Typed Firebase Doc](https://github.com/th-m/firebase-typed/blob/master/assets/typed_doc.gif)

![Tab-able](https://github.com/th-m/firebase-typed/blob/master/assets/tabable_path.gif)

## `$` methods

This utility provides helper methods to automatically turn db references into queries or listeners. These are denoted by the `$`.  Also the are fully typed by inference. So your handler functions will be checked automagically. 

![type inference](https://github.com/th-m/firebase-typed/blob/master/assets/error_path.png)

![type inference](https://github.com/th-m/firebase-typed/blob/master/assets/happy_path.png)


## Package exports
- typedAdminDB
- TypedAdminDB 
- typedRealTimeDB 
- TypedRealTimeDB


## TODO
- [x] proof of concept for admin firebase functions
- [x] proof of concept for realtime database
- [ ] proof of concept for firestore
- [ ] add and document list of all firebase methods