import BuildClient from './frontend';

(async () => {
  const { error } = await BuildClient();

  if (error) throw error;
})();
