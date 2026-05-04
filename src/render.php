<?php
/**
 * Server-side rendering for the Advanced Post Grid block.
 *
 * @package AdvancedPostGrid
 */

// Cast attributes to ensure type safety before query execution.
$post_count    = isset( $attributes['postCount'] ) ? absint( $attributes['postCount'] ) : 3;
$category_id   = isset( $attributes['categoryId'] ) ? absint( $attributes['categoryId'] ) : 0;
$columns       = isset( $attributes['columns'] ) ? absint( $attributes['columns'] ) : 3;

// Set query parameters using strict evaluation.
$order_by      = isset( $attributes['orderBy'] ) && 'title' === $attributes['orderBy'] ? 'title' : 'date';
$display_image = isset( $attributes['displayImage'] ) ? rest_sanitize_boolean( $attributes['displayImage'] ) : true;

/**
 * Build optimized WP_Query arguments.
 * 'no_found_rows' bypasses SQL_CALC_FOUND_ROWS for performance.
 * 'update_post_term_cache' is disabled to save DB queries.
 */
$query_args = array(
	'post_type'              => 'post',
	'post_status'            => 'publish',
	'posts_per_page'         => $post_count,
	'orderby'                => $order_by,
	'order'                  => 'date' === $order_by ? 'DESC' : 'ASC',
	'no_found_rows'          => true,
	'ignore_sticky_posts'    => true,
	'update_post_meta_cache' => $display_image,
	'update_post_term_cache' => false,
);

// Append category filter securely if selected.
if ( 0 < $category_id ) {
	$query_args['cat'] = $category_id;
}

$post_query = new WP_Query( $query_args );

// Inject BEM class and dynamic CSS variables for the layout.
$wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'advanced-post-grid-preview',
		'style' => sprintf( '--apg-columns: %d;', $columns ),
	)
);

?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() escapes internally. ?>>
	<div class="advanced-post-grid-preview__content">
		<?php if ( $post_query->have_posts() ) : ?>
			
			<ul class="advanced-post-grid-preview__list" style="display: grid; grid-template-columns: repeat(var(--apg-columns, 3), 1fr); gap: 20px;">
				<?php while ( $post_query->have_posts() ) : ?>
					<?php $post_query->the_post(); ?>
					<li class="advanced-post-grid-preview__item">
						
						<?php /* --- FEATURED IMAGE --- */ ?>
						<?php if ( true === $display_image && has_post_thumbnail() ) : ?>
							<div class="advanced-post-grid-preview__image" style="margin-bottom: 15px;">
								<a href="<?php echo esc_url( get_permalink() ); ?>" aria-hidden="true" tabindex="-1">
									<?php
									the_post_thumbnail(
										'medium',
										array(
											'loading' => 'lazy',
											'alt'     => esc_attr( get_the_title() ),
										)
									);
									?>
								</a>
							</div>
						<?php endif; ?>

						<h4>
							<a href="<?php echo esc_url( get_permalink() ); ?>">
								<?php echo esc_html( get_the_title() ); ?>
							</a>
						</h4>
						<div class="advanced-post-grid-preview__excerpt">
							<?php echo wp_kses_post( get_the_excerpt() ); ?>
						</div>
					</li>
				<?php endwhile; ?>
			</ul>
			<?php wp_reset_postdata(); ?>
			
		<?php else : ?>
			<div class="apg-state apg-state--empty">
				<p><?php esc_html_e( 'No posts found matching this criteria.', 'advanced-post-grid' ); ?></p>
			</div>
		<?php endif; ?>
	</div>
</div>