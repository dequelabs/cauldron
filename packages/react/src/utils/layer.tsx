import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

/**
 * A container's DOM region plus the regions of everything rendered inside it
 * in the React tree, including overlays portaled elsewhere in the DOM.
 * Click outside, focus trap and aria-hidden isolation use it to decide what is
 * "inside" a container.
 */
export interface Layer {
  /** This layer's element and the elements of all nested layers. */
  elements: () => Element[];
  /** True when `node` is in this layer's element or any nested layer. */
  contains: (node: Node | null) => boolean;
  /** Registers a nested layer's element; returns the unregister function. */
  register: (element: Element) => () => void;
}

const LayerContext = createContext<Layer | null>(null);

function createLayer(
  getElement: () => Element | null,
  parent: Layer | null
): Layer {
  const nested = new Set<Element>();
  const elements = () => {
    const element = getElement();
    return element ? [element, ...nested] : [...nested];
  };
  return {
    elements,
    contains: (node) =>
      !!node && elements().some((element) => element.contains(node)),
    register: (element) => {
      nested.add(element);
      // the parent owns everything its nested layers own
      const unregisterFromParent = parent?.register(element);
      return () => {
        nested.delete(element);
        unregisterFromParent?.();
      };
    }
  };
}

/**
 * Makes the element in `ref` a layer that registers with the surrounding
 * layer, so the surrounding container treats it as inside. Render children
 * inside `<LayerProvider layer={layer}>` so nested overlays register with it.
 */
export function useLayer(ref: React.RefObject<Element | null>): Layer {
  const parent = useContext(LayerContext);
  const [layer] = useState(() => createLayer(() => ref.current, parent));
  const registration = useRef<{
    element: Element;
    unregister: () => void;
  } | null>(null);

  // Refs are set during commit, so sync the registration after every commit.
  useEffect(() => {
    const element = ref.current;
    if (registration.current?.element === element) {
      return;
    }
    registration.current?.unregister();
    registration.current =
      element && parent
        ? { element, unregister: parent.register(element) }
        : null;
  });

  useEffect(
    () => () => {
      registration.current?.unregister();
      registration.current = null;
    },
    []
  );

  return layer;
}

export function LayerProvider({
  layer,
  children
}: {
  layer: Layer;
  children: React.ReactNode;
}) {
  return (
    <LayerContext.Provider value={layer}>{children}</LayerContext.Provider>
  );
}
