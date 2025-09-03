export interface IAccountSearch {
  accounts: Array<{
    slug: string;
    name: string;
    avatar: string;
    type: string;
  }>;
}
