import mockDB from '../data/user-mock.json';
import { IRegisterFormState } from '../interfaces';

export const useValidate = (updateState: (el: keyof IRegisterFormState, value: unknown) => void) => {
  const validate = async (field: string, value: string) => {
    if (value !== '') {
      switch (field) {
        case 'email': {
          if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
            updateState('checkingEmail', true);

            const alreadyRegistered = new Promise((res) => {
              let exists = false;

              const timer = setTimeout(() => {
                try {
                  if (mockDB.find((el) => el.email === value)) {
                    exists = true;
                  }
                } finally {
                  clearTimeout(timer);
                  res(exists);
                }
              }, 2000);
            });

            const res = await alreadyRegistered;

            if (res) {
              updateState('checkingEmail', false);
              updateState('errors', {
                email: 'O e-mail digitado já tem cadastro ≧◠‿◠≦✌',
              });

              return false;
            }

            updateState('checkingEmail', false);
            updateState('errors', { email: '' });

            return true;
          }

          updateState('errors', {
            email: 'A gente precisa do seu e-mail válido pra seguir com o cadastro.',
          });

          return false;
        }
        case 'username': {
          if (value.length < 3) {
            return false;
          }

          if (!/[^a-zA-Z0-9\_]/g.test(value)) {
            updateState('checkingUsername', true);

            const checkUsername = new Promise((res) => {
              const timer = setTimeout(() => {
                try {
                  if (mockDB.find((el) => el.username === value)) {
                    res(true);
                  }

                  res(false);
                } finally {
                  updateState('checkingUsername', false);
                  clearTimeout(timer);
                }
              }, 1000);
            });

            const res = await checkUsername;

            if (res) {
              updateState('errors', {
                username: 'Opa! Esse username já foi abocanhado ( ͡╥ ͜ʖ ͡╥)',
              });

              return false;
            }

            updateState('errors', { username: '' });
            return true;
          }

          updateState('errors', {
            username: 'Opa, parece que tem caracteres especiais no seu username :/',
          });

          return false;
        }
      }
    } else {
      updateState('errors', { [field]: '' });
    }
  };

  return {
    validate,
  };
};
