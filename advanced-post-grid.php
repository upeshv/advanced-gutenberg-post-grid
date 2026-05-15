<?php
/**
 * Plugin Name:       Advanced Post Grid
 * Description:       A dynamic React-powered post grid for enterprise filtering.
 * Version:           1.0.0
 * Requires at least: 6.2
 * Tested up to:      6.9
 * Requires PHP:      7.4
 * Author:            Upesh Vishwakarma
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       advanced-post-grid
 *
 * @package AdvancedPostGrid
 */

namespace Upesh\AdvancedPostGrid;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Registers the block using the metadata loaded from the block.json file.
 *
 * @since 1.0.0
 *
 * @return void
 */
function register_grid_block() {
	register_block_type( __DIR__ . '/build' );
}

add_action( 'init', __NAMESPACE__ . '\register_grid_block' );