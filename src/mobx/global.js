import { types } from 'mobx-state-tree';

const ListData = types
  .model({
    textScan: types.string,
    url: types.string,
    idImg: types.string,
    uidUser: types.string,
    // emailUser: types.string,
    isLoading: types.boolean,
    navigate: types.string,
  })
  .actions(self => ({
    setTextScan(text) {
      self.textScan = text;
    },
    setUrl(url) {
      self.url = url;
    },
    setIdImg(id) {
      self.idImg = id;
    },
    setUidUser(uid) {
      self.uidUser = uid;
    },
    // setEmailUser(email) {
    //   self.emailUser = email;
    // },
    toggleLoading() {
      self.isLoading = !self.isLoading;
    },
    setNavigate(text) {
      self.navigate = text;
    },
  }))
  .create({
    textScan: 'default',
    url: 'default',
    idImg: '0',
    uidUser: 'default',
    // emailUser: 'default',
    isLoading: false,
    navigate: 'Login',
  });

export default ListData;
