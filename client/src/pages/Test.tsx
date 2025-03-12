import { useParams } from 'react-router';

export const Test = () => {
  const { token } = useParams();

  return (
    <div>
      <p>Token: {token}</p>
    </div>
  );
};
