import { IGoogle, ITapEventDetail, IUserGoogle } from 'interfaces';
import { decodeJWT, getDataURL } from 'utils';

const clientLib = 'https://accounts.google.com/gsi/client';

export const googleAuth = () => {
  let google: IGoogle;
  let tapEvent: CustomEvent<ITapEventDetail>;

  const init = () => {
    const script = document.createElement('script');
    script.setAttribute('async', '');
    script.setAttribute('src', clientLib);

    return new Promise<IGoogle>((res, rej) => {
      script.addEventListener('load', () => {
        const { google: GOOGLE } = window;

        if (!GOOGLE) return rej('Failed to load google client library');

        GOOGLE.accounts.id.initialize({
          client_id: String(process.env.GOOGLE_CLIENT_ID),
          callback: async (_res) => {
            if (!_res.credential) {
              tapEvent = new CustomEvent('oneTapClick', {
                cancelable: false,
                detail: {
                  success: false,
                  user: undefined,
                },
              });
              document.dispatchEvent(tapEvent);
              return;
            }

            const data = decodeJWT(_res.credential);
            const profileImg = await fetch(data.picture);
            const imgBlob = await profileImg.blob();
            const imgBase64 = await getDataURL(imgBlob);

            const user = {
              ...data,
              picture: imgBase64,
            };

            tapEvent = new CustomEvent('oneTapClick', {
              cancelable: false,
              detail: {
                success: true,
                user,
              },
            });

            document.dispatchEvent(tapEvent);
          },
          cancel_on_tap_outside: false,
          color_scheme: 'dark',
          // auto_select: true,
          context: 'use',
        });

        google = GOOGLE;

        res(google);
      });

      script.addEventListener('error', () => {
        document.head.removeChild(script);
        return rej('Failed to load google client library');
      });

      document.head.appendChild(script);
    });
  };

  const startGoogleSignIn = async () => {
    if (typeof window === 'undefined') return;

    await init();

    google.accounts.id.prompt();

    return new Promise<IUserGoogle | undefined>((res, rej) => {
      document.addEventListener('oneTapClick', (e: CustomEvent<ITapEventDetail>) => {
        const { success, user } = e.detail;

        if (!success) return rej('OneTap error!');

        return res(user);
      });
    });
  };

  const showGoogleButton = async (buttonParent: HTMLElement, cb?: () => void) => {
    if (!google) await init();

    google.accounts.id.renderButton(buttonParent, {
      type: 'icon',
      locale: 'pt',
      theme: 'filled_black',
      shape: 'rectangular',
      size: 'large',
      click_listener: cb,
    });
  };

  return {
    startGoogleSignIn,
    showGoogleButton,
  };
};
