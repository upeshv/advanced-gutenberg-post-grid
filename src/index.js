/**
 * Entry point for the Advanced Post Grid block.
 *
 * Bootstraps the React components and styles into the Gutenberg editor.
 */

// Import Core Block capabilities.
import { registerBlockType } from '@wordpress/blocks';

// Import Webpack compiled styles.
import './style.scss';

// Import Internal Dependencies.
import Edit from './edit';
import metadata from './block.json';

/**
 * Register the Block.
 * * @note This is a dynamic block. The React 'Edit' component manages the editor state, 
 * but the frontend is strictly rendered via PHP (render.php). Therefore, the 'save' 
 * method must explicitly return null to prevent static HTML serialization.
 */
registerBlockType( metadata.name, {
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	save: () => null,
} );
