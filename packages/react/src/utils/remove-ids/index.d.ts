/// <reference types="react" />
declare function recursivelyRemoveIds(
  element: React.ReactNode
):
  | import('react').ReactElement<
      any,
      | string
      | ((
          props: any
        ) =>
          | import('react').ReactElement<
              any,
              | string
              | any
              | (new (props: any) => import('react').Component<any, any, any>)
            >
          | null)
      | (new (props: any) => import('react').Component<any, any, any>)
    >
  | import('react').ReactElement<
      any,
      | string
      | ((
          props: any
        ) =>
          | import('react').ReactElement<
              any,
              | string
              | any
              | (new (props: any) => import('react').Component<any, any, any>)
            >
          | null)
      | (new (props: any) => import('react').Component<any, any, any>)
    >[]
  | null
  | undefined;
export default recursivelyRemoveIds;
