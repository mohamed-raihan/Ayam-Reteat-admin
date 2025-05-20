export const API_URL = {
  USER: {
    GET_USERS: "/api/register/",
    GET_USER: (uuid: string) => `/api/register/${uuid}/`,
  },
  MEMBERSHIP: {
    GET_MEMBERSHIP: "/api/subscription/list/",
    GET_MEMBERSHIP_BY_ID: (uuid: string) => `/api/subscription/list/${uuid}/`,
    CREATE_MEMBERSHIP: "/api/subscription/create/",
    UPDATE_MEMBERSHIP: (uuid: string) => `/api/subscription/create/${uuid}/`,
    DELETE_MEMBERSHIP: (uuid: string) => `/api/subscription/create/${uuid}/`,
  },
  PARTNER_RESORT: {
    GET_PARTNER_RESORT: "/api/resorts/",
    GET_PARTNER_RESORT_BY_ID: (uuid: string) => `/api/resorts/${uuid}/`,
    CREATE_PARTNER_RESORT: "/api/resorts/",
    UPDATE_PARTNER_RESORT: (uuid: string) => `/api/resorts/${uuid}/`,
    DELETE_PARTNER_RESORT: (uuid: string) => `/api/resorts/${uuid}/`,
  },
  PLACE: {
    CREATE_PLACE: "/api/place/",
  },
  REFERRAL: {
    GET_REFERRAL: "/api/referrals/all/",
    GET_REFERRAL_BY_ID: "/api/referrals/",
    ADD_POINT: "/api/points/",
    DEDUCT_POINT: (id: string) => `/api/points/${id}/`,
    POINT_HISTORY: (uuid: string) => `/api/points/${uuid}/`,
  },

  RESERVATION: {
    GET_RESERVATION: "/api/forms/",
  },
};
