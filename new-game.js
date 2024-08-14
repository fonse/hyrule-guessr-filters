const configs = [
  {
    id: "blur",
    label: "Blur",
  },
  {
    id: "invert",
    label: "Invert colors",
  },
  {
    id: "greyscale",
    label: "Greyscale",
  }
]

const ctaElement = document.querySelector('.start-game-btn-container');
const configContainer = document.createElement('div');
configContainer.style.marginTop = '2px';

configs.forEach(config => { 
  const div = document.createElement('div');
  div.classList.add('form-check', 'form-check-inline');
  
  const checkbox = document.createElement('input');
  checkbox.id = config.id;
  checkbox.type = 'checkbox';
  checkbox.classList.add('form-check-input');
  checkbox.onchange = (event) => {
    chrome.storage.sync.set({ [config.id]: event.target.checked });
  }

  chrome.storage.sync.get(config.id).then((value) => {
    if (!!value[config.id]) {
      checkbox.checked = value;
    }
  });
  
  const label = document.createElement('label');
  label.htmlFor = config.id;
  label.classList.add('form-check-label');
  label.textContent = config.label;

  div.append(checkbox, label);
  configContainer.append(div);
});

ctaElement.before(configContainer);

