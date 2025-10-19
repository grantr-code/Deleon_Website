import { ref } from 'vue';

// Simple global store for the Early Access panel
const isEarlyPanelOpen = ref(false);

export function useEarlyAccessPanel() {
  function open() { isEarlyPanelOpen.value = true; }
  function close() { isEarlyPanelOpen.value = false; }
  function toggle() { isEarlyPanelOpen.value = !isEarlyPanelOpen.value; }
  return { isOpen: isEarlyPanelOpen, open, close, toggle };
}

