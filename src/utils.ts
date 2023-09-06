//
// HTML helper functions
//

export function getButton(id: string) {
  return document.querySelector<HTMLButtonElement>(`#${id}`)!;
}

export function getDiv(id: string) {
  return document.querySelector<HTMLDivElement>(`#${id}`)!;
}

export function setHTML(id: string, html: string, append = false) {
  if (append) {
    getDiv(id).innerHTML += html;
    return;
  }

  getDiv(id).innerHTML = html;
}

export function clearError() {
  getDiv("error").innerHTML = "";
  getDiv("error").style.display = "none";
}

export function showError(error: any) {
  getDiv("error").innerHTML = error;
  getDiv("error").style.display = "block";
}
