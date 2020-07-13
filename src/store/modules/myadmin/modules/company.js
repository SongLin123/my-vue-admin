import api from '@/api'
export default {
  namespaced: true,
  state: {

    miniLogo: '',
    normalLogo: '',
    companyName: '',
    adminName: '',
    adminPhone: ''
  },
  actions: {

    async load({ state, dispatch, commit }) {
      const res = await api.SYS_CONFIG_QUERYCONFIG()
      state.normalLogo = res.data.enterpriseLogoUrl
      state.miniLogo = res.data.enterpriseSmallLogoUrl
      state.companyName = res.data.enterpriseName
      state.adminName = res.data.manageName
      state.adminPhone = res.data.managePhone
    }
  }
}
