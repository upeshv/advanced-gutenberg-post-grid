/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import metadata from './block.json';
import Edit from './edit';
import './style.scss';

/**
 * Registers the Advanced Post Grid block.
 */
registerBlockType( metadata, {
	edit: Edit,
	save: () => null,
} );