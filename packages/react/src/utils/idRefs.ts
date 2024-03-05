type IdRefs = string | null | undefined;

/**
 * Returns a unique set of ref ids from the provided id string
 * @param ids - id string
 */
export default function idRefs(ids: IdRefs): Set<string> {
  if (!ids || !ids.trim()) {
    return new Set<string>();
  }
  return new Set(ids.trim().split(/\s+/));
}

/**
 * Returns an updated idRef string with the provided id value added
 * @param ids - id string
 * @param id - id to add
 */
export function addIdRef(ids: IdRefs, id: string): string {
  return [...idRefs(ids).add(id)].join(' ');
}

/**
 * Returns an updated idRef string with the provided id value removed
 * @param ids - id string
 * @param id - id to remove
 */
export function removeIdRef(_ids: IdRefs, id: string): string {
  const ids = idRefs(_ids);
  ids.delete(id);
  return [...ids].join(' ');
}

/**
 * Returns if a idRef string contains the provided id value
 * @param ids - id string
 * @param id - id to check if it exists in the provided idRef string
 */
export function hasIdRef(ids: IdRefs, id: string): boolean {
  return idRefs(ids).has(id);
}
