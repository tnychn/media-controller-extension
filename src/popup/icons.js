const Icons = {
  play: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.50632 3.14928C6.1753 2.29363 4.4248 3.24931 4.4248 4.83164V19.1683C4.4248 20.7506 6.1753 21.7063 7.50632 20.8507L18.6571 13.6823C19.8817 12.8951 19.8817 11.1049 18.6571 10.3176L7.50632 3.14928Z" fill="currentColor"/>
</svg>`,
  forward: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.42091 4.83828C2.43562 4.07194 1 4.77409 1 6.02231V17.9777C1 19.2259 2.43562 19.928 3.42091 19.1617L11.6139 12.7893C11.8575 12.5999 12 12.3086 12 12V17.9777C12 19.2259 13.4356 19.928 14.4209 19.1617L22.6139 12.7893C22.8575 12.5999 23 12.3086 23 12C23 11.6914 22.8575 11.4001 22.6139 11.2106L14.4209 4.83828C13.4356 4.07194 12 4.77409 12 6.02231V12C12 11.6914 11.8575 11.4001 11.6139 11.2106L3.42091 4.83828Z" fill="currentColor"/>
  </svg>`,
  backward: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9.57909 4.83828C10.5644 4.07194 12 4.77409 12 6.02231V12V17.9777C12 19.2259 10.5644 19.928 9.57909 19.1617L1.38606 12.7893C1.14247 12.5999 1 12.3086 1 12C1 11.6914 1.14247 11.4001 1.38606 11.2106L9.57909 4.83828Z" fill="currentColor"/>
  <path d="M12 12C12 12.3086 12.1425 12.5999 12.3861 12.7893L20.5791 19.1617C21.5644 19.928 23 19.2259 23 17.9777V6.02231C23 4.77409 21.5644 4.07194 20.5791 4.83828L12.3861 11.2106C12.1425 11.4001 12 11.6914 12 12Z" fill="currentColor"/>
  </svg>`,
  pause: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 3C4.89543 3 4 3.89543 4 5V19C4 20.1046 4.89543 21 6 21H9C10.1046 21 11 20.1046 11 19V5C11 3.89543 10.1046 3 9 3H6Z" fill="currentColor"/>
  <path d="M15 3C13.8954 3 13 3.89543 13 5V19C13 20.1046 13.8954 21 15 21H18C19.1046 21 20 20.1046 20 19V5C20 3.89543 19.1046 3 18 3H15Z" fill="currentColor"/>
  </svg>`,
  muted: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.1657 2.14424C12.8728 2.50021 13 3.27314 13 3.7446V20.2561C13 20.7286 12.8717 21.4998 12.1656 21.8554C11.416 22.2331 10.7175 21.8081 10.3623 21.4891L4.95001 16.6248H3.00001C1.89544 16.6248 1.00001 15.7293 1.00001 14.6248L1 9.43717C1 8.3326 1.89543 7.43717 3 7.43717H4.94661L10.3623 2.51158C10.7163 2.19354 11.4151 1.76635 12.1657 2.14424Z" fill="currentColor"/>
  <path d="M21.8232 15.6767C21.4327 16.0673 20.7995 16.0673 20.409 15.6768L18.5 13.7678L16.591 15.6768C16.2005 16.0673 15.5673 16.0673 15.1768 15.6767L14.8233 15.3232C14.4327 14.9327 14.4327 14.2995 14.8233 13.909L16.7322 12L14.8232 10.091C14.4327 9.70044 14.4327 9.06727 14.8232 8.67675L15.1767 8.3232C15.5673 7.93267 16.2004 7.93267 16.591 8.32319L18.5 10.2322L20.409 8.32319C20.7996 7.93267 21.4327 7.93267 21.8233 8.3232L22.1768 8.67675C22.5673 9.06727 22.5673 9.70044 22.1768 10.091L20.2678 12L22.1767 13.909C22.5673 14.2995 22.5673 14.9327 22.1767 15.3232L21.8232 15.6767Z" fill="currentColor"/>
  </svg>`,
  unmuted: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M13 3.7446C13 3.27314 12.8728 2.50021 12.1657 2.14424C11.4151 1.76635 10.7163 2.19354 10.3623 2.51158L4.94661 7.43717H3C1.89543 7.43717 1 8.3326 1 9.43717L1.00001 14.6248C1.00001 15.7293 1.89544 16.6248 3.00001 16.6248H4.95001L10.3623 21.4891C10.7175 21.8081 11.416 22.2331 12.1656 21.8554C12.8717 21.4998 13 20.7286 13 20.2561V3.7446Z" fill="currentColor"/>
  <path d="M17.336 3.79605L17.0952 3.72886C16.5633 3.58042 16.0117 3.89132 15.8632 4.42329L15.7289 4.90489C15.5804 5.43685 15.8913 5.98843 16.4233 6.13687L16.6641 6.20406C18.9551 6.84336 20.7501 9.14615 20.7501 12.0001C20.7501 14.854 18.9551 17.1568 16.6641 17.7961L16.4233 17.8632C15.8913 18.0117 15.5804 18.5633 15.7289 19.0952L15.8632 19.5768C16.0117 20.1088 16.5633 20.4197 17.0952 20.2713L17.336 20.2041C20.7957 19.2387 23.2501 15.8818 23.2501 12.0001C23.2501 8.11832 20.7957 4.76146 17.336 3.79605Z" fill="currentColor"/>
  <path d="M16.3581 7.80239L16.1185 7.73078C15.5894 7.57258 15.0322 7.87329 14.874 8.40243L14.7308 8.88148C14.5726 9.41062 14.8733 9.96782 15.4024 10.126L15.642 10.1976C16.1752 10.3571 16.75 11.012 16.75 12C16.75 12.9881 16.1752 13.643 15.642 13.8024L15.4024 13.874C14.8733 14.0322 14.5726 14.5894 14.7308 15.1185L14.874 15.5976C15.0322 16.1267 15.5894 16.4274 16.1185 16.2692L16.3581 16.1976C18.1251 15.6693 19.25 13.8987 19.25 12C19.25 10.1014 18.1251 8.33068 16.3581 7.80239Z" fill="currentColor"/>
  </svg>`,
  discard: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><line x1="9" x2="15" y1="15" y2="9"/><circle cx="12" cy="12" r="10"/></svg>`,
  close: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
};

export default Icons;
