import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export function asyncComponent<T, R>(
  fn: (arg: T) => Promise<R>
): (arg: T) => R {
  // @ts-ignore
  return fn as (arg: T) => R;
}

export interface NotionOnNextPageObjectResponse extends PageObjectResponse {
  slug: string | undefined;
  title: string | undefined;
  coverImage: string | undefined;
  databaseName: string;
  databaseId: string;
}

export interface mediaMapInterface {
  [key: string]: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

export type MediaMap = {
  [key: string]: MediaMapPage | {};
};

export type MediaMapPage = {
  cover: string;
  [key: string]: string;
};

export interface configInterface {
  databases: {
    [key: string]: {
      id: string;
      name: string;
    };
  };
  typesFolderPath: string | null;
}
