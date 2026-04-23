<?php
/**
 * Plugin Name:       Advanced Post Grid
 * Description:       A dynamic React-powered post grid for enterprise filtering.
 * Version:           1.0.0
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Author:            Upesh Vishwakarma
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       advanced-post-grid
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Registers the block using the stable.
 */
function advanced_post_grid_block_init() {
    register_block_type( __DIR__ . '/build' );
}

add_action( 'init', 'advanced_post_grid_block_init' );