export const configProvider = () => {
  return {
    appRoot: process.env.APP_ROOT as string,
    isDev: process.env.NODE_ENV !== 'production',
    assetsUrl: process.env.ACCOUNT_API?.concat('/assets'),
  };
};
