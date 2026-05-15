=== Advanced Post Grid ===
Contributors:      Upesh Vishwakarma
Tags:              block, posts, dynamic, gutenberg/react, grid
Requires at least: 6.2
Tested up to:      6.9
Requires PHP:      7.4
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A high-performance, enterprise-grade dynamic post grid block featuring hybrid React/PHP rendering and strict VIP coding standards.

== Description ==

Advanced Post Grid is a production-ready dynamic block designed for high-traffic WordPress environments. It utilizes a hybrid architecture: a reactive, state-driven interface for the block editor and an optimized, secure PHP rendering engine for the frontend.

The block is built with a focus on performance, accessibility, and Core Web Vitals, ensuring that content delivery is fast and SEO-friendly.

**Key Features:**
* **Hybrid Architecture:** Reactive React editor interface with secure PHP server-side rendering.
* **Query Optimization:** Implements `no_found_rows` to bypass heavy SQL calculations for maximum performance.
* **Layout Controls:** Dynamic column support, post count limits, and custom ordering logic.
* **Image Optimization:** Built-in CLS (Cumulative Layout Shift) protection with aspect-ratio containers.
* **Resilient UI:** Includes React Error Boundaries to handle API interruptions gracefully.
* **Automated Quality:** Includes a full Jest unit testing suite verifying UI states and API resolution.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/advanced-post-grid` directory.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. In the Block Editor, search for "Advanced Post Grid" and add it to any page or post.

== Testing the Block ==

To verify the enterprise-grade functionality:

1. Ensure your site has published posts with Categories and Featured Images.
2. Add the 'Advanced Post Grid' block to a post.
3. Use the Block Sidebar (Inspector Controls) to test reactivity:
    * Adjust 'Number of Posts' and 'Columns' to see the layout update instantly.
    * Toggle 'Show Featured Image' to verify responsive media handling.
    * Modify 'Filter by Category' or 'Order By' to trigger cached REST API resolution.
4. Save and verify the frontend output matches the editor preview exactly.

== Compatibility and Security ==

**Security & Performance:**
* **Type-Safety:** Attributes are strictly cast (absint, rest_sanitize_boolean) before evaluation.
* **Late Escaping:** All output is escaped via `esc_html`, `esc_url`, and `wp_kses_post`.
* **SQL Optimization:** Query parameters are tuned for WordPress VIP and high-scale environments.
* **Global Safety:** Uses PHP Namespaces to prevent function collisions.

**Compatibility:**
* **WordPress:** 6.1 through 6.5+.
* **PHP:** 7.4 through 8.2+.
* **Standards:** Adheres to WCAG 2.2 Accessibility and Core Web Vitals benchmarks.

== Frequently Asked Questions ==

= Does the block make constant API calls? =
No. It utilizes the `@wordpress/data` store cache. The REST API is only queried when block attributes are modified in a way that requires fresh data resolution.

= Is it mobile responsive? =
Yes. The grid utilizes a CSS variable-driven layout with a fallback to a single-column stack on mobile devices to ensure a clean UI on all screens.

= Are there automated tests? =
Yes. A Jest test suite is included to verify the UI lifecycle and API failure states. Run `npm run test:unit` to execute.

== Changelog ==

= 1.0.0 =
* Initial production release.
* Added Column and Image toggle controls.
* Implemented SQL query optimizations.
* Added Error Boundary support.