export const configProvider = () => {
  return {
    appRoot: String(process.env.APP_ROOT),
    isDev: process.env.NODE_ENV !== 'production',
    assetsUrl: String(process.env.ACCOUNT_API?.concat('/assets/')),
    defaultCover: new URL(
      'url:../assets/images/generic-cover.jpeg?as=webp',
      import.meta.url,
    ).toString(),
  };
};
