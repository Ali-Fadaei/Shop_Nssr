const routes = {
  // common: {
  //   user: 'common/user',
  // },
  panel: {
    otp: {
      generate: 'panel/otp/generate',
      confirm: 'panel/otp/confirm',
      resetPassword: 'panel/otp/resetPassword',
    },
    auth: {
      signIn: 'panel/auth/signIn',
      refresh: 'panel/auth/refresh',
      logOut: 'panel/auth/logOut',
      otp: {
        gererate: 'panel/auth/otp/generate',
        confirm: 'panel/auth/otp/confirm',
        changePassword: 'panel/auth/otp/changePassword',
      },
    },
    user: 'panel/user',
    dashboard: 'panel/dashboard',
    admin: 'panel/admin',
    zone: 'panel/zone',
  },
  client: {
    otp: {
      generate: 'client/otp/generate',
      confirm: 'client/otp/confirm',
      resetPassword: 'client/otp/resetPassword',
    },
    auth: {
      signUp: 'client/auth/signUp',
      signIn: 'client/auth/signIn',
      refresh: 'client/auth/refresh',
      logOut: 'client/auth/logOut',
      otp: {
        gererate: 'client/auth/otp/generate',
        confirm: 'client/auth/otp/confirm',
        changePassword: 'client/auth/otp/changePassword',
      },
    },
  },
  site: {
    auth: {},
  },
};

export default routes;
