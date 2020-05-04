// used for components that need to access and set the ref
export default function setRef<T>(ref: React.Ref<T>, element: T) {
  if (!ref) return;

  if (typeof ref === 'function') {
    ref(element);
  } else {
    // @ts-ignore
    // we need to overwrite the existing value in some special cases
    ref.current = element;
  }
}
