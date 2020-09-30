# firebase-typed
Typescript utility for firebase. Provides intellisense and type safety for realtime db and firestore methods and documents.


## Usage



All you need to create a typed instance of your db is an defined interface.

```
### Import

import { typedRealTimeDB, TypedRealTimeDB } from 'firebase-typed';

export interface Game {
    host: Player,
    characters: Character,
    players: Players,
    playersActions: PlayersActions,
    status: GameStatus,
    ...
}

const db = typedRealTimeDB<Game>()
```

## Example

For reference the interface demoed looks like this 


![Typed Firebase Doc](https://storage.googleapis.com/firebase-typed-gifs/typed_doc.gif)

![Tab-able](https://storage.googleapis.com/firebase-typed-gifs/tabable_path.gif)

## `$` methods

This utility provides helper methods to automatically turn db references into queries or listeners. These are denoted by the `$`.  Also the are fully typed by inference. So your handler functions will be checked automagically. 

![type inference](https://storage.googleapis.com/firebase-typed-gifs/error_path.png)

![type inference](https://storage.googleapis.com/firebase-typed-gifs/happy_path.png)


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