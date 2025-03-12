const acceptedOrigins = ['https://localhost:3001'];

export const log = (message: string) => {
  message = `(${new Date().toLocaleString('pt-BR')}) - ${message}.`;
  console.log(message);
};

export const originIsAllowed = (origin: string) => {
  if (acceptedOrigins.includes(origin)) return true;
};
