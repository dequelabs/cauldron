type IdRefs = string | null | undefined;

/**
 * Returns a unique set of id refs from the provided string
 * @param ids - string of id refs
 */
export default function idRefs(ids: IdRefs): Set<string> {
  if (!ids || !ids.trim()) {
    return new Set<string>();
  }
  return new Set(ids.trim().split(/\s+/));
}

/**
 * Returns an updated id ref string with the provided id value added
 * @param ids - string of id refs
 * @param id - id to add
 */
export function addIdRef(ids: IdRefs, id: string): string {
  return [...idRefs(ids).add(id)].join(' ');
}

/**
 * Returns an updated id ref string with the provided id value removed
 * @param ids - string of id refs
 * @param id - id to remove
 */
export function removeIdRef(_ids: IdRefs, id: string): string {
  const ids = idRefs(_ids);
  ids.delete(id);
  return [...ids].join(' ');
}

/**
 * Returns if an id ref string contains the provided id value
 * @param ids - string of id refs
 * @param id - id to check if it exists in the provided idRef string
 */
export function hasIdRef(ids: IdRefs, id: string): boolean {
  return idRefs(ids).has(id);
}
