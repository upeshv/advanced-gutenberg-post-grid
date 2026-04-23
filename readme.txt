=== Advanced Post Grid ===
Contributors:      Upesh Vishwakarma
Tags:              block, grid, dynamic, react
Tested up to:      6.5
Requires at least: 6.1
Requires PHP:      7.4
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A custom Gutenberg block that fetches and filters posts using the WordPress REST API and local React state.

== Description ==

Advanced Post Grid is a dynamic block built to demonstrate modern full-stack block development. 

The editor interface is built with React and uses the `@wordpress/data` store for real-time REST API fetching, while the frontend relies on a standard PHP `render.php` file for secure server-side rendering.

**Core Features:**
* Dynamic category filtering and post count limits.
* React-driven editor interface using standard WordPress components.
* Data fetching via the `useSelect` hook (bypassing full page reloads).
* Includes a Jest unit testing suite with mocked API data (`src/edit.test.js`).

== Installation ==

1. Upload the plugin files to your `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Navigate to any Page or Post and add the "Advanced Post Grid" block.

== Testing the Block ==

To verify the dynamic fetching and filtering functionality:

1. Ensure your WordPress installation has at least 3-5 published posts.
2. Assign different Categories to these posts.
3. In the Block Editor, add the 'Advanced Post Grid' block.
4. Use the Block Sidebar (Inspector Controls) to:
    * Adjust the 'Number of Posts' slider to see the grid update in real-time.
    * Toggle the 'Filter by Category' dropdown to verify the REST API resolution for specific categories.
5. Save the post and verify the frontend output matches the editor preview.

== Compatibility and Security ==

**Security Measures:**
* **Type-Safe Attributes:** All block attributes are strictly cast (absint) before being passed to WP_Query to prevent injection.
* **Output Sanitization:** Frontend data is escaped using `esc_html`, `esc_url`, and `wp_kses_post` to adhere to WordPress security best practices.
* **Capability Checks:** The dynamic API fetching relies on the core WordPress REST API, which respects default user permission levels for post types.

**Compatibility:**
* **WordPress:** Optimized for version 6.1 and above.
* **PHP:** Compatible with PHP 7.4 through 8.2+.
* **Browser Support:** Supports all modern evergreen browsers.
* **Theme Agnostic:** Uses standard BEM-inspired CSS classes to ensure styling remains isolated from the parent theme.

== Frequently Asked Questions ==

= Does the block make constant API calls? =
No. The `useSelect` hook relies on the local WordPress data store cache. It only pings the REST API when the user explicitly changes the block attributes (like the category or post count).

= Are there tests included? =
Yes, a basic Jest test suite is included to verify the UI lifecycle (Loading, Populated, Empty states). Run `npm run test:unit` to execute.

== Changelog ==

= 1.0.0 =
* Initial release.