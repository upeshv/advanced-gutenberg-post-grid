/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, Spinner, Notice } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

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
    const blockProps = useBlockProps();

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
    const categoryOptions = [ { label: __( 'All Categories', 'my-post-grid' ), value: 0 } ];
    if ( categories ) {
        categories.forEach( ( cat ) => {
            categoryOptions.push( { label: cat.name, value: cat.id } );
        } );
    }

    return (
        <div { ...blockProps }>
            
            {/* --- SIDEBAR SETTINGS --- */}
            <InspectorControls>
                <PanelBody title={ __( 'Grid Settings', 'my-post-grid' ) }>
                    <RangeControl
                        label={ __( 'Number of Posts', 'my-post-grid' ) }
                        value={ postCount }
                        onChange={ ( value ) => setAttributes( { postCount: value } ) }
                        min={ 1 }
                        max={ 12 }
                        __next40pxDefaultSize={ true }
                        __nextHasNoMarginBottom={ true }
                    />
                    <SelectControl
                        label={ __( 'Filter by Category', 'my-post-grid' ) }
                        value={ categoryId }
                        options={ categoryOptions }
                        onChange={ ( value ) => setAttributes( { categoryId: parseInt( value, 10 ) } ) }
                        __next40pxDefaultSize={ true }
                        __nextHasNoMarginBottom={ true }
                    />
                </PanelBody>
            </InspectorControls>

            {/* --- VISUAL EDITOR PREVIEW --- */}
            <div className="my-custom-post-grid-preview">
                
                { ! hasResolved ? (
                    // State 1: Still fetching data from REST API
                    <div className="loading-state">
                        <Spinner />
                        <p>{ __( 'Fetching latest posts...', 'my-post-grid' ) }</p>
                    </div>

                ) : ! posts?.length ? (
                    // State 2: API returned empty (No posts found)
                    <Notice status="warning" isDismissible={ false }>
                        { __( 'No posts found for this category.', 'my-post-grid' ) }
                    </Notice>

                ) : (
                    // State 3: Success! Map over the array and render the React components
                    <ul className="post-grid-list">
                        { posts.map( ( post ) => (
                            <li key={ post.id } className="post-item">
                                <h4>{ post.title.rendered }</h4>
                                {/* dangerouslySetInnerHTML is required because WP excerpt contains HTML tags */}
                                <div dangerouslySetInnerHTML={ { __html: post.excerpt.rendered } } />
                            </li>
                        ) ) }
                    </ul>
                ) }
            </div>
            
        </div>
    );
}
