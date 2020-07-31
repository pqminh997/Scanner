import {types} from 'mobx-state-tree';
// import {LightTheme, DarkTheme} from '../style/color';

const Themes = types
  .model({
    isDarkMode: types.boolean,
    theme: types.frozen(),
  })
  .actions(self => ({
    toggleTheme() {
      self.isDarkMode = !self.isDarkMode;
      // if (self.isDarkMode) {
      //   self.theme = DarkTheme;
      // } else {
      //   self.theme = LightTheme;
      // }
    },
  }))
  .create({
    isDarkMode: true,
    // theme: LightTheme,
  });

export default Themes;
