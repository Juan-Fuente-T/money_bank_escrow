
/**
 * Updates the console in the UI with the given arguments.
 *
 * @param {...any} args - The arguments to be displayed in the console.
 * @return {void}
 */
export function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
    console.log(...args);
  }