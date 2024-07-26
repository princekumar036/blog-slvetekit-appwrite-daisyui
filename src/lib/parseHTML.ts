
export function parseHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
  
    // Extract the first <h1>
    const h1 = doc.querySelector('h1');
    const title = h1 ? h1.textContent : null;
  
    // Extract the first image
    const firstImage = doc.querySelector('img');
    const heroImg = firstImage ? firstImage.src : null;
  
    // Remove the first <h1> and the first image from the document
    if (h1) {
      h1.remove();
    }
    if (firstImage) {
      firstImage.remove();
    }
  
    // Get the rest of the content as body
    const body = doc.body.innerHTML;
  
    return { title, body, heroImg };
  }