/***********************************
 * Wait before turning things off *
 ***********************************/

// The wait starts when the menu opens, and starts over whenever the menu is
// hidden (popup closed, or the settings tab left), so it has to be sat
// through. Once it is over, changes are free until the menu is hidden again.
let waitStartedAt = Date.now();

const WAIT_STATUS = qs('#wait_status');
const WAIT_OPTION = qs('#settings-wait');
const waitModalContainer = qs('#wait_container_background');
const WAIT_MINUTES_INPUT = qs('#wait_minutes');
const WAIT_PRESETS = qsa('#wait_presets a');

function unlockDelay() {
  return parseUnlockDelay(cache['unlock_delay']);
}

function waitRemainingMs() {
  return Math.max(0, waitStartedAt + unlockDelay() * 60_000 - Date.now());
}

function formatWait(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

// Call before any change that loosens. Returns whether it may go ahead, and
// tells the user how long is left if not.
function allowLoosening() {
  const remaining = waitRemainingMs();
  if (!remaining) return true;
  displayStatus(`Wait ${formatWait(remaining)} to turn things off`, 2500);
  return false;
}

function updateWaitStatus() {
  const delay = unlockDelay();
  WAIT_STATUS.toggleAttribute('hidden', delay === 0);
  if (delay === 0) return;

  const remaining = waitRemainingMs();
  WAIT_STATUS.toggleAttribute('locked', remaining > 0);
  WAIT_STATUS.innerText = remaining > 0
    ? `Turning off unlocks in ${formatWait(remaining)}`
    : 'Turning off unlocked';
}
setInterval(updateWaitStatus, 250);

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') waitStartedAt = Date.now();
  updateWaitStatus();
});


// Delay setting. A longer delay is stricter, so it applies at once; a shorter
// one, or none, needs the current wait first.
function setUnlockDelay(value) {
  const minutes = parseUnlockDelay(value);
  if (minutes < unlockDelay() && !allowLoosening()) {
    WAIT_MINUTES_INPUT.value = unlockDelay();
    return;
  }
  WAIT_MINUTES_INPUT.value = minutes;
  updateSetting('unlock_delay', minutes, { manual: true });
  updateWaitStatus();
}

function openWaitModal() {
  WAIT_MINUTES_INPUT.value = unlockDelay();
  waitModalContainer.removeAttribute('hidden');
}

function closeWaitModal() {
  waitModalContainer.setAttribute('hidden', '');
}

WAIT_OPTION.addEventListener('click', () => openWaitModal());
waitModalContainer.addEventListener('click', e => {
  if (e.target === waitModalContainer) closeWaitModal();
});
WAIT_MINUTES_INPUT.addEventListener('change', () => setUnlockDelay(WAIT_MINUTES_INPUT.value));
WAIT_PRESETS.forEach(node => {
  node.addEventListener('click', () => setUnlockDelay(node.getAttribute('minutes')));
});
