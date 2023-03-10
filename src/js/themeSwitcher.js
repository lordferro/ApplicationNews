export class ThemeSwitcher {
    constructor(deskSwitchEl, mobSwitchEl) {
      this.themeSwitcherEl = deskSwitchEl;
      this.mobileSwitcherEl = mobSwitchEl;
      this.dateField = document.querySelector('.date-field');
      this.dataSelected = document.querySelector(".data_selected");
      this.currentPage = document.querySelector('body').getAttribute('data-current-page');
      this.THEME_STORAGE_KEY = 'theme';
      this.Theme = {
        LIGHT: 'light',
        DARK: 'dark',
      };
    }
  
    onThemeToggle = () => {
      const isLightTheme = this.getBoolean();
  
      if (isLightTheme) {
        localStorage.setItem(this.THEME_STORAGE_KEY, this.Theme.DARK);
      }
  
      if (!isLightTheme) {
        localStorage.setItem(this.THEME_STORAGE_KEY, this.Theme.LIGHT);
      }
  
      this.renderTheme();
      return;
    };
  
    renderTheme() {
      const isLightTheme = this.getBoolean();
  
      if (!isLightTheme) {
        this.themeSwitcherEl.setAttribute('checked', true);
        this.mobileSwitcherEl.setAttribute('checked', true);
        this.changeBodyClass(this.Theme.DARK, this.Theme.LIGHT);
        if (this.currentPage === "index") {
          this.dataSelected.style.color = "#F4F4F4";
          this.dataSelected.style.backgroundColor = "#2E2E2E";
          console.log(this.dataSelected.style.backgroundColor)
          this.dateField.style.backgroundColor = "#2E2E2E";
        }
      }
  
      if (isLightTheme) {
        this.changeBodyClass(this.Theme.LIGHT, this.Theme.DARK);
        if (this.currentPage === "index") {
          this.dataSelected.style.color = "#111321";
          this.dataSelected.style.backgroundColor = "#F4F4F4";
          this.dateField.style.backgroundColor = "#F4F4F4";
        }
      }
    }
  
    changeBodyClass(add, remove) {
      document.body.classList.add(add);
      document.body.classList.remove(remove);
    }
  
    getBoolean() {
      const storageTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
      return storageTheme === this.Theme.LIGHT || !storageTheme;
    }
  }
  