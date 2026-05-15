/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, SelectControl, Spinner, Notice, ToggleControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useMemo, RawHTML } from '@wordpress/element';

/**
 * Internal dependencies
 */
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { postCount, categoryId, columns, orderBy, order, displayImage } = attributes;

	const blockProps = useBlockProps( {
		className: 'advanced-post-grid',
		style: { '--apg-columns': columns },
	} );

	const { posts, hasResolved, apiError, categories } = useSelect(
		( select ) => {
			const { getEntityRecords, hasFinishedResolution } = select( 'core' );

			const postQuery = {
				per_page: postCount,
				status: 'publish',
				orderby: orderBy,
				order: order,
				_embed: true,
				...( categoryId ? { categories: categoryId } : {} ),
			};

			const queryArgs = [ 'postType', 'post', postQuery ];

			return {
				posts: getEntityRecords( ...queryArgs ),
				hasResolved: hasFinishedResolution( 'getEntityRecords', queryArgs ),
				apiError: hasFinishedResolution( 'getEntityRecords', queryArgs ) && getEntityRecords( ...queryArgs ) === null,
				categories: getEntityRecords( 'taxonomy', 'category', { per_page: 100 } ),
			};
		},
		[ postCount, categoryId, orderBy, order ]
	);

	const categoryOptions = useMemo( () => {
		return [
			{ label: __( 'All Categories', 'advanced-post-grid' ), value: 0 },
			...( categories?.map( ( cat ) => ( { label: cat.name, value: cat.id } ) ) || [] ),
		];
	}, [ categories ] );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Grid Layout Settings', 'advanced-post-grid' ) }>
					<RangeControl
						label={ __( 'Number of Posts', 'advanced-post-grid' ) }
						value={ postCount }
						onChange={ ( value ) => setAttributes( { postCount: value } ) }
						min={ 1 }
						max={ 12 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={ __( 'Columns', 'advanced-post-grid' ) }
						value={ columns }
						onChange={ ( value ) => setAttributes( { columns: value } ) }
						min={ 1 }
						max={ 6 }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Show Featured Image', 'advanced-post-grid' ) }
						checked={ displayImage }
						onChange={ ( value ) => setAttributes( { displayImage: value } ) }
						__nextHasNoMarginBottom={ true }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Query Settings', 'advanced-post-grid' ) } initialOpen={ false }>
					<SelectControl
						label={ __( 'Filter by Category', 'advanced-post-grid' ) }
						value={ categoryId }
						options={ categoryOptions }
						onChange={ ( value ) => setAttributes( { categoryId: parseInt( value, 10 ) } ) }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Order By', 'advanced-post-grid' ) }
						value={ orderBy }
						options={ [
							{ label: __( 'Date', 'advanced-post-grid' ), value: 'date' },
							{ label: __( 'Title', 'advanced-post-grid' ), value: 'title' },
						] }
						onChange={ ( value ) => setAttributes( { orderBy: value } ) }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={ __( 'Order', 'advanced-post-grid' ) }
						value={ order }
						options={ [
							{ label: __( 'Descending (Newest First)', 'advanced-post-grid' ), value: 'desc' },
							{ label: __( 'Ascending (Oldest First)', 'advanced-post-grid' ), value: 'asc' },
						] }
						onChange={ ( value ) => setAttributes( { order: value } ) }
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div className="advanced-post-grid__content">
				{ ! hasResolved ? (
					<div className="advanced-post-grid__state advanced-post-grid__state--loading">
						<Spinner />
						<p>{ __( 'Fetching latest posts...', 'advanced-post-grid' ) }</p>
					</div>
				) : apiError ? (
					<Notice status="error" isDismissible={ false }>
						{ __( 'Error loading posts. Please check your connection or REST API status.', 'advanced-post-grid' ) }
					</Notice>
				) : ! posts?.length ? (
					<Notice status="warning" isDismissible={ false }>
						{ __( 'No posts found matching this criteria.', 'advanced-post-grid' ) }
					</Notice>
				) : (
					<ul className="advanced-post-grid__list">
						{ posts.map( ( post ) => {
							const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.medium?.source_url || post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

							return (
								<li key={ post.id } className="advanced-post-grid__item">
									{ displayImage && (
										<div
											className="advanced-post-grid__image-wrapper"
											style={ { backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' } }
											role="img"
											aria-label={ post.title.rendered }
										></div>
									) }
									<h4 className="advanced-post-grid__title">
										{/* WCAG: Prevent dummy links from trapping keyboard users in the editor */}
										<a 
											href="#preview" 
											onClick={ ( e ) => e.preventDefault() }
											tabIndex="-1"
										>
											{ post.title.rendered }
										</a>
									</h4>
									
									<div className="advanced-post-grid__excerpt">
										<RawHTML>{ post.excerpt.rendered }</RawHTML>
									</div>
								</li>
							);
						} ) }
					</ul>
				) }
			</div>
		</div>
	);
}