# Advanced Gutenberg Custom Block: Post Grid

A production-ready, dynamic Gutenberg block built for enterprise WordPress environments. This plugin demonstrates the integration of modern React state management with high-performance PHP server-side rendering.

The editor interface is built with React and uses the `@wordpress/data` store for real-time REST API fetching, while the frontend relies on a standard PHP `render.php` file for secure server-side rendering.

## 🚀 Technical Architecture

* **Backend Rendering:** Utilizes dynamic PHP rendering to ensure maximum SEO compatibility and caching efficiency for high-traffic environments.
* **Frontend State (React):** Demonstrates **state-driven React development**—specifically focusing on data fetching, state management, complex component architecture, and modern hooks. It leverages the WordPress Block API v3 and `@wordpress/data` store to efficiently handle REST API payloads without redundant network requests.
* **Standards:** Strictly adheres to WordPress VIP coding standards, WCAG 2.1 Accessibility benchmarks, and Core Web Vitals optimization.
* **Automated Testing:** Includes a Jest unit testing suite with mocked API data to verify UI lifecycles.

## 🛠️ Installation & Setup

To use this block in a local or production environment, you need to compile the React assets.

1. Clone the repository into your WordPress plugins folder (`/wp-content/plugins/`):

        git clone https://github.com/upeshv/advanced-gutenberg-post-grid.git
        cd advanced-gutenberg-post-grid

2. Install Node dependencies:

        npm install

3. Run the automated test suite to verify your local setup:

        npm run test:unit

4. Compile the assets for production:

        npm run build

5. Activate the plugin through the 'Plugins' screen in the WordPress Admin Dashboard.

## 💻 Available NPM Commands

This project uses `@wordpress/scripts` for build and test pipelines.

* **`npm start`**: Compiles assets in development mode and watches for changes.
* **`npm run build`**: Compiles and minifies assets for production.
* **`npm run test:unit`**: Executes the Jest testing suite (`src/edit.test.js`) to verify the React component lifecycles (Loading, Populated, Empty states).
* **`npm run lint:js`**: Runs ESLint to ensure JavaScript coding standards.

## 🧪 Testing the Block UI

To verify the dynamic fetching and filtering functionality:

1. Ensure your WordPress installation has at least 3-5 published posts with varying Categories.
2. Navigate to any Page or Post and add the **Advanced Post Grid** block.
3. Use the Block Sidebar (Inspector Controls) to:
    * Adjust the **Number of Posts** slider to see the grid update in real-time.
    * Toggle the **Filter by Category** dropdown to verify the REST API resolution.
4. Save the post and verify the frontend output matches the editor preview perfectly.

## 🛡️ Security & Compatibility

**Security Measures:**

* **Type-Safe Attributes:** All block attributes are strictly cast (e.g., `absint`) before being passed to `WP_Query` to prevent injection vulnerabilities.
* **Output Sanitization:** Frontend data is escaped using `esc_html`, `esc_url`, and `wp_kses_post` adhering to strict WordPress security standards.
* **Capability Checks:** Dynamic API fetching relies on the core WordPress REST API, which natively respects default user permission levels for post types.

**Compatibility:**

* **WordPress:** Optimized for version 6.1+ (Tested up to 6.5).
* **PHP:** 7.4 through 8.2+.
* **Theme Agnostic:** Utilizes standard BEM-inspired CSS classes to ensure styling remains isolated from the parent theme.

## ❓ FAQ

**Does the block make constant API calls?**
No. The `useSelect` hook relies on the local WordPress data store cache. It only pings the REST API when the user explicitly changes the block attributes (like the category or post count) in the Inspector Controls.