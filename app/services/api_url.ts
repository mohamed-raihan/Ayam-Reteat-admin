export const API_URL = {
  USER: {
    GET_USERS: "/api/register/",
    GET_USER: (uuid: string) => `/api/register/${uuid}/`,
  },
  MEMBERSHIP: {
    GET_MEMBERSHIP: "/api/subscription/list/",
    GET_MEMBERSHIP_BY_ID: (uuid: string) => `/api/subscription/list/${uuid}/`,
    CREATE_MEMBERSHIP: "/api/subscription/create/",
    UPDATE_MEMBERSHIP: (uuid: string) => `/api/subscription/${uuid}/`,
    DELETE_MEMBERSHIP: (uuid: string) => `/api/subscription/${uuid}/`,
  },
  PARTNER_RESORT: {
    GET_PARTNER_RESORT: "/api/resorts/",
    GET_PARTNER_RESORT_BY_ID: (uuid: string) => `/api/resorts/${uuid}/`,
    CREATE_PARTNER_RESORT: "/api/resorts/",
    UPDATE_PARTNER_RESORT: (uuid: string) => `/api/resorts/${uuid}/`,
    DELETE_PARTNER_RESORT: (uuid: string) => `/api/resorts/${uuid}/`,
  },

  RESORT_FORMDATA:{
    CREATE_RESORT_FORMDATA: "/api/form-data/",
    EDIT_RESORT_FORMDATA: (id: string) => `/api/form-data/${id}/`,
    IMAGE_UPLOAD:(uuid:string) => `/api/form-data/${uuid}/upload-multiple-images/`,
  },

  RESORT_WELLCOME:{
    CREATE_RESORT_WELLCOME: "/api/welcome/",
    EDIT_RESORT_WELLCOME: (id: string) => `/api/welcome/${id}/`,
  },

  RESORT_WHYCHOOSE:{
    CREATE_RESORT_WHYCHOOSE: "/api/whychoose/",
    EDIT_RESORT_WHYCHOOSE: (id: string) => `/api/whychoose/${id}/`,
  },

  PLACE: {
    CREATE_PLACE: "/api/place/",
  },
  REFERRAL: {
    GET_REFERRAL: "/api/referrals/all/",
    GET_REFERRAL_BY_ID: "/api/referrals/",
    ADD_POINT: "/api/points/",
    DEDUCT_POINT: `/api/points/`,
    POINT_HISTORY: (uuid: string) => `/api/points/${uuid}/`,
  },

  RESERVATION: {
    GET_RESERVATION: "/api/forms/",
  },

  RESORT_FEATURES: {
    GET_RESORT_FEATURES: "/api/features/",
    CREATE_RESORT_FEATURES: "/api/features/",
    DELETE_RESORT_FEATURES: (id: string) => `/api/features/${id}/`,
  },

  RESORT_PROPERITIES: {
    GET_RESORT_PROPERITIES: "/api/properties/",
    CREATE_RESORT_PROPERITIES: "/api/properties/",
    DELETE_RESORT_PROPERITIES: (id: string) => `/api/properties/${id}/`,
  },
};
