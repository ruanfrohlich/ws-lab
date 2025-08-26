export interface IUserGoogle {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  nbf: number;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  iat: number;
  exp: number;
  jti: string;
}

interface ICredential {
  id: string;
  password: string;
}

export interface ITapEventDetail {
  success: boolean;
  user?: IUserGoogle;
}

interface ICredentialResponse {
  credential: string;
  selected_by:
    | 'auto'
    | 'user'
    | 'fedcm'
    | 'fedcm_auto'
    | 'user_1tap'
    | 'user_2tap'
    | 'itp'
    | 'itp_confirm'
    | 'btn'
    | 'btn_confirm';
  state: string;
}

interface IGsiButtonConfiguration {
  type: 'icon' | 'standard';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
  locale?: string;
  click_listener?: () => void;
  state?: string;
}

interface IIdConfiguration {
  client_id: string;
  color_scheme?: 'default' | 'light' | 'dark';
  auto_select?: boolean;
  callback: (response: ICredentialResponse) => void;
  login_uri?: URL;
  native_callback?: (credential: ICredential) => void;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  context?: 'signin' | 'signup' | 'use';
  state_cookie_domain?: string;
  ux_mode?: 'popup' | 'redirect';
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: () => void;
  itp_support?: boolean;
  login_hint?: string;
  hd?: string;
  use_fedcm_for_prompt?: boolean;
  use_fedcm_for_button?: boolean;
  button_auto_select?: boolean;
}

interface IRevocationResponse {
  successful: boolean;
  error?: string;
}

type TNotDisplayReason =
  | 'browser_not_supported'
  | 'invalid_client'
  | 'missing_client_id'
  | 'opt_out_or_no_session'
  | 'secure_http_required'
  | 'suppressed_by_user'
  | 'unregistered_origin'
  | 'unknown_reason';

type TSkippedReason =
  | 'auto_cancel'
  | 'user_cancel'
  | 'tap_outside'
  | 'issuing_failed';

type TDismissedReason =
  | 'credential_returned'
  | 'cancel_called'
  | 'flow_restarted';

type TMomentType = 'display' | 'skipped' | 'dismissed';

interface IPromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => TNotDisplayReason;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => TSkippedReason;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => TDismissedReason;
  getMomentType: () => TMomentType;
}

export interface IGoogle {
  accounts: {
    id: {
      initialize: (config: IIdConfiguration) => void;
      prompt: (cb?: (notification: IPromptMomentNotification) => void) => void;
      renderButton: (
        parent: HTMLElement,
        options: IGsiButtonConfiguration,
      ) => void;
      disableAutoSelect: () => void;
      storeCredential: (credentials: ICredential) => void;
      cancel: () => void;
      revoke: (
        login_hint: string,
        cb: (done: IRevocationResponse) => void,
      ) => void;
    };
  };
}
