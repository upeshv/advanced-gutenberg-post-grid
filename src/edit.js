/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, Spinner, Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { RawHTML } from '@wordpress/element';

/**
 * Styles
 */
import './editor.scss';

/**
 * Edit component for the Advanced Post Grid.
 * Manages local UI state and handles real-time REST API resolution for the block editor.
 *
 * @param {Object}   props               Component properties.
 * @param {Object}   props.attributes    Block attributes from block.json.
 * @param {Function} props.setAttributes Function to trigger Redux state updates.
 * @return {JSX.Element} The rendered editor interface.
 */
export default function Edit( { attributes, setAttributes } ) {
    const { postCount, categoryId } = attributes;

    // Automatically injects the correct generic block classes based on block.json namespace
    const blockProps = useBlockProps( {
        className: 'advanced-post-grid-preview'
    } );

    // Resolve data from the core WordPress store.
    // Dependencies array ensures we only ping the REST API when attributes change.
    const { posts, hasResolved, categories } = useSelect(
        ( select ) => {
            const { getEntityRecords, hasFinishedResolution } = select( 'core' );

            const postQuery = {
                per_page: postCount,
                status: 'publish',
                // Only append category filter if a specific category is selected
                ...( categoryId ? { categories: categoryId } : {} ) 
            };

            return {
                posts: getEntityRecords( 'postType', 'post', postQuery ),
                hasResolved: hasFinishedResolution( 'getEntityRecords', [ 'postType', 'post', postQuery ] ),
                categories: getEntityRecords( 'taxonomy', 'category', { per_page: -1 } ),
            };
        },
        [ postCount, categoryId ]
    );

    // Format categories for the SelectControl component
    const categoryOptions = [ { label: __( 'All Categories', 'advanced-post-grid' ), value: 0 } ];
    if ( categories ) {
        categories.forEach( ( cat ) => {
            categoryOptions.push( { label: cat.name, value: cat.id } );
        } );
    }

    return (
        <div { ...blockProps }>
            
            {/* --- SIDEBAR SETTINGS --- */}
            <InspectorControls>
                <PanelBody title={ __( 'Grid Settings', 'advanced-post-grid' ) }>
                    <RangeControl
                        label={ __( 'Number of Posts', 'advanced-post-grid' ) }
                        value={ postCount }
                        onChange={ ( value ) => setAttributes( { postCount: value } ) }
                        min={ 1 }
                        max={ 12 }
                        __next40pxDefaultSize={ true }
                        __nextHasNoMarginBottom={ true }
                    />
                    <SelectControl
                        label={ __( 'Filter by Category', 'advanced-post-grid' ) }
                        value={ categoryId }
                        options={ categoryOptions }
                        onChange={ ( value ) => setAttributes( { categoryId: parseInt( value, 10 ) } ) }
                        __next40pxDefaultSize={ true }
                        __nextHasNoMarginBottom={ true }
                    />
                </PanelBody>
            </InspectorControls>

            {/* --- VISUAL EDITOR PREVIEW --- */}
            <div className="advanced-post-grid-preview__content">
                
                { ! hasResolved ? (
                    // State 1: Still fetching data from REST API
                    <div className="loading-state">
                        <Spinner />
                        <p>{ __( 'Fetching latest posts...', 'advanced-post-grid' ) }</p>
                    </div>

                ) : ! posts?.length ? (
                    // State 2: API returned empty (No posts found)
                    <Notice status="warning" isDismissible={ false }>
                        { __( 'No posts found for this category.', 'advanced-post-grid' ) }
                    </Notice>

                ) : (
                    // State 3: Success! Map over the array and render the React components
                    <ul className="advanced-post-grid-preview__list">
                        { posts.map( ( post ) => (
                            <li key={ post.id } className="advanced-post-grid-preview__item">
                                <h4>{ post.title.rendered }</h4>
                                {/* RawHTML safely parses the excerpt string and strips malicious tags natively */}
                                <RawHTML>{ post.excerpt.rendered }</RawHTML>
                            </li>
                        ) ) }
                    </ul>
                ) }
            </div>
            
        </div>
    );
}
