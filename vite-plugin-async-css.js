// vite-plugin-async-css.js
// Plugin to make CSS loading non-blocking for better performance

export default function asyncCSSPlugin() {
  return {
    name: 'vite-plugin-async-css',
    enforce: 'post',
    transformIndexHtml(html, { bundle }) {
      if (!bundle) return html;

      // Find the main CSS file
      const cssFile = Object.keys(bundle).find(file =>
        file.endsWith('.css') && file.startsWith('assets/index-')
      );

      if (!cssFile) return html;

      const cssPath = `/${cssFile}`;

      // Inject the CSS loading script
      return html.replace(
        '// Vite will inject the correct CSS path here',
        `loadCSS("${cssPath}");`
      );
    }
  };
}
