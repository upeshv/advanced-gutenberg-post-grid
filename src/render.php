<?php
/**
 * Server-side rendering for the Advanced Post Grid block.
 *
 * @package AdvancedPostGrid
 */

namespace Upesh\AdvancedPostGrid;

// Prevent direct access to this file for security.
defined( 'ABSPATH' ) || exit;

/**
 * Variables injected dynamically by WordPress Core.
 *
 * @var array    $attributes The block attributes.
 * @var string   $content    The block content.
 * @var WP_Block $block      The block instance.
 */

// Cast attributes to ensure strict type safety before query execution.
$apg_post_count  = isset( $attributes['postCount'] ) ? absint( $attributes['postCount'] ) : 3;
$apg_category_id = isset( $attributes['categoryId'] ) ? absint( $attributes['categoryId'] ) : 0;
$apg_columns     = isset( $attributes['columns'] ) ? absint( $attributes['columns'] ) : 3;

// Set query parameters using strict evaluation against allowed enums.
$apg_order_by      = isset( $attributes['orderBy'] ) && in_array( $attributes['orderBy'], array( 'date', 'title', 'menu_order', 'rand' ), true ) ? $attributes['orderBy'] : 'date';
$apg_order         = isset( $attributes['order'] ) && 'asc' === $attributes['order'] ? 'ASC' : 'DESC';
$apg_display_image = isset( $attributes['displayImage'] ) ? rest_sanitize_boolean( $attributes['displayImage'] ) : true;

/**
 * Build optimized WP_Query arguments.
 *
 * 'no_found_rows' bypasses SQL_CALC_FOUND_ROWS to improve database performance.
 * 'update_post_term_cache' is disabled to save redundant queries.
 */
$apg_query_args = array(
	'post_type'              => 'post',
	'post_status'            => 'publish',
	'posts_per_page'         => $apg_post_count,
	'orderby'                => $apg_order_by,
	'order'                  => $apg_order,
	'no_found_rows'          => true,
	'ignore_sticky_posts'    => true,
	'update_post_meta_cache' => $apg_display_image, // Only cache meta if displaying thumbnails.
	'update_post_term_cache' => false,
);

// Append category filter securely if selected.
if ( 0 < $apg_category_id ) {
	$apg_query_args['cat'] = $apg_category_id;
}

// Instantiate WP_Query from the global namespace.
$apg_post_query = new \WP_Query( $apg_query_args );

// Inject BEM class and dynamic CSS variables for the layout.
$apg_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'advanced-post-grid',
		'style' => sprintf( '--apg-columns: %d;', $apg_columns ),
	)
);

?>

<div <?php echo $apg_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes escapes internally. ?>>
	<div class="advanced-post-grid__content">
		<?php if ( $apg_post_query->have_posts() ) : ?>
			
			<ul class="advanced-post-grid__list">
				<?php while ( $apg_post_query->have_posts() ) : ?>
					<?php $apg_post_query->the_post(); ?>
					<li class="advanced-post-grid__item">
						
						<?php /* --- FEATURED IMAGE --- */ ?>
						<?php if ( true === $apg_display_image && has_post_thumbnail() ) : ?>
							<div class="advanced-post-grid__image-wrapper">
								<?php /* Hide redundant image links from screen readers for accessibility */ ?>
								<a href="<?php echo esc_url( get_permalink() ); ?>" aria-hidden="true" tabindex="-1">
									<?php
									the_post_thumbnail(
										'medium',
										array(
											'loading' => 'lazy',
											'alt'     => esc_attr( wp_strip_all_tags( get_the_title() ) ),
											'class'   => 'advanced-post-grid__image', 
										)
									);
									?>
								</a>
							</div>
						<?php endif; ?>

						<h4 class="advanced-post-grid__title">
							<a href="<?php echo esc_url( get_permalink() ); ?>">
								<?php echo esc_html( get_the_title() ); ?>
							</a>
						</h4>
						
						<div class="advanced-post-grid__excerpt">
							<?php echo wp_kses_post( get_the_excerpt() ); ?>
						</div>
					</li>
				<?php endwhile; ?>
			</ul>
			<?php wp_reset_postdata(); ?>
			
		<?php else : ?>
			<div class="advanced-post-grid__state advanced-post-grid__state--empty">
				<p><?php esc_html_e( 'No posts found matching this criteria.', 'advanced-post-grid' ); ?></p>
			</div>
		<?php endif; ?>
	</div>
</div>