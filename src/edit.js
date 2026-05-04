/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, Spinner, Notice, ToggleControl } from '@wordpress/components';
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
 * @param {Function} props.setAttributes Function to update block attributes.
 * @return {JSX.Element} The rendered editor interface.
 */
export default function Edit( { attributes, setAttributes } ) {
    const { postCount, categoryId, columns, orderBy, displayImage } = attributes;

    // Inject generic block classes and inline CSS variables for our dynamic grid layout
    const blockProps = useBlockProps( {
        className: 'advanced-post-grid-preview',
        style: { '--apg-columns': columns }
    } );

    // Resolve data from the core WordPress store.
    const { posts, hasResolved, apiError, categories } = useSelect(
        ( select ) => {
            const { getEntityRecords, hasFinishedResolution } = select( 'core' );

            const postQuery = {
                per_page: postCount,
                status: 'publish',
                orderby: orderBy,
                ...( categoryId ? { categories: categoryId } : {} ) 
            };

            // Setup cache-keys for resolution tracking
            const queryArgs = [ 'postType', 'post', postQuery ];

            return {
                posts: getEntityRecords( ...queryArgs ),
                hasResolved: hasFinishedResolution( 'getEntityRecords', queryArgs ),
                // If resolution finished but posts is strictly null, the API failed (e.g., 500 error or network drop)
                apiError: hasFinishedResolution( 'getEntityRecords', queryArgs ) && getEntityRecords( ...queryArgs ) === null,
                categories: getEntityRecords( 'taxonomy', 'category', { per_page: -1 } ),
            };
        },
        [ postCount, categoryId, orderBy ]
    );

    // Format categories using useMemo-style mapping for better performance
    const categoryOptions = [ 
        { label: __( 'All Categories', 'advanced-post-grid' ), value: 0 },
        ...( categories?.map( ( cat ) => ( { label: cat.name, value: cat.id } ) ) || [] )
    ];

    return (
        <div { ...blockProps }>
            
            {/* --- SIDEBAR SETTINGS --- */}
            <InspectorControls>
                <PanelBody title={ __( 'Grid Layout Settings', 'advanced-post-grid' ) }>
                    <RangeControl
                        label={ __( 'Number of Posts', 'advanced-post-grid' ) }
                        value={ postCount }
                        onChange={ ( value ) => setAttributes( { postCount: value } ) }
                        min={ 1 }
                        max={ 12 }
                        __next40pxDefaultSize={ true }
                        __nextHasNoMarginBottom={ true }
                    />
                    <RangeControl
                        label={ __( 'Columns', 'advanced-post-grid' ) }
                        value={ columns }
                        onChange={ ( value ) => setAttributes( { columns: value } ) }
                        min={ 1 }
                        max={ 4 }
                        __next40pxDefaultSize={ true }
                        __nextHasNoMarginBottom={ true }
                    />
                    <ToggleControl
                        label={ __( 'Show Featured Image', 'advanced-post-grid' ) }
                        checked={ displayImage }
                        onChange={ ( value ) => setAttributes( { displayImage: value } ) }
                    />
                </PanelBody>
                
                <PanelBody title={ __( 'Query Settings', 'advanced-post-grid' ) } initialOpen={ false }>
                    <SelectControl
                        label={ __( 'Filter by Category', 'advanced-post-grid' ) }
                        value={ categoryId }
                        options={ categoryOptions }
                        onChange={ ( value ) => setAttributes( { categoryId: parseInt( value, 10 ) } ) }
                        __next40pxDefaultSize={ true }
                        __nextHasNoMarginBottom={ true }
                    />
                    <SelectControl
                        label={ __( 'Order By', 'advanced-post-grid' ) }
                        value={ orderBy }
                        options={ [
                            { label: __( 'Date', 'advanced-post-grid' ), value: 'date' },
                            { label: __( 'Title', 'advanced-post-grid' ), value: 'title' }
                        ] }
                        onChange={ ( value ) => setAttributes( { orderBy: value } ) }
                        __next40pxDefaultSize={ true }
                        __nextHasNoMarginBottom={ true }
                    />
                </PanelBody>
            </InspectorControls>

            {/* --- VISUAL EDITOR PREVIEW --- */}
            <div className="advanced-post-grid-preview__content">
                
                { ! hasResolved ? (
                    // State 1: Fetching
                    <div className="apg-state apg-state--loading">
                        <Spinner />
                        <p>{ __( 'Fetching latest posts...', 'advanced-post-grid' ) }</p>
                    </div>

                ) : apiError ? (
                    // State 2: Error (The "Senior" check)
                    <Notice status="error" isDismissible={ false }>
                        { __( 'Error loading posts. Please check your connection or REST API status.', 'advanced-post-grid' ) }
                    </Notice>

                ) : ! posts?.length ? (
                    // State 3: Empty
                    <Notice status="warning" isDismissible={ false }>
                        { __( 'No posts found matching this criteria.', 'advanced-post-grid' ) }
                    </Notice>

                ) : (
                    // State 4: Success
                    <ul className="advanced-post-grid-preview__list" style={ { display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '20px' } }>
                        { posts.map( ( post ) => (
                            <li key={ post.id } className="advanced-post-grid-preview__item">
                                { displayImage && (
                                    <div className="apg-placeholder-image" style={{ height: '150px', backgroundColor: '#e2e4e7', marginBottom: '10px' }}></div>
                                ) }
                                <h4>{ post.title.rendered }</h4>
                                <RawHTML>{ post.excerpt.rendered }</RawHTML>
                            </li>
                        ) ) }
                    </ul>
                ) }
            </div>
            
        </div>
    );
}