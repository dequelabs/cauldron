# cauldron react

## installation

```sh
$ npm install @deque/cauldron-react --save
```

and pull in the styles:

```sh
$ npm install @deque/cauldron-styles --save
```

## server-side rendering

Avoid referencing `window` properties, such as `document`, unless you are sure the code will only be executed in a browser environment. For instance, it is safe to reference `document` in an [Effect Hook](https://reactjs.org/docs/hooks-effect.html) or a lifecycle method like `componentDidMount()`, but not in the `render()` method of a class component.

Ensuring you only reference these objects when it is safe to do so will ensure that library consumers can use Cauldron with platforms that use an SSR engine, such as GatsbyJS and NextJS.
