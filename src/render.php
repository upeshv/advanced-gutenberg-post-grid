<?php
/**
 * Server-side rendering for the Advanced Post Grid block.
 *
 * @package AdvancedPostGrid
 */

// Cast attributes to ensure type safety before query execution
$post_count  = isset( $attributes['postCount'] ) ? absint( $attributes['postCount'] ) : 3;
$category_id = isset( $attributes['categoryId'] ) ? absint( $attributes['categoryId'] ) : 0;

/**
 * Build optimized WP_Query arguments.
 * 'no_found_rows' is used to bypass SQL_CALC_FOUND_ROWS for performance
 * as pagination is not required for this grid.
 * ignore_sticky_posts' prevents cache fragmentation.
 */
$query_args = array(
    'post_type'           => 'post',
    'post_status'         => 'publish',
    'posts_per_page'      => $post_count,
    'no_found_rows'       => true, 
    'ignore_sticky_posts' => true, 
);

// Append category filter securely if selected.
if ( $category_id > 0 ) {
    $query_args['cat'] = $category_id;
}

$post_query = new WP_Query( $query_args );

// Inject our root BEM class into the core block wrapper.
// This allows to merge our class with user-defined alignment/color styles.
$wrapper_attributes = get_block_wrapper_attributes( array(
    'class' => 'advanced-post-grid-preview'
) );

?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="advanced-post-grid-preview__content">
        <?php if ( $post_query->have_posts() ) : ?>
            <ul class="advanced-post-grid-preview__list">
                <?php while ( $post_query->have_posts() ) : $post_query->the_post(); ?>
                    <li class="advanced-post-grid-preview__item">
                        <h4>
                            <a href="<?php echo esc_url( get_permalink() ); ?>">
                                <?php echo esc_html( get_the_title() ); ?>
                            </a>
                        </h4>
                        <div class="advanced-post-grid-preview__excerpt">
                            <?php 
                            // Safely output the excerpt allowing basic HTML tags
                            echo wp_kses_post( get_the_excerpt() ); 
                            ?>
                        </div>
                    </li>
                <?php endwhile; ?>
            </ul>
            <?php wp_reset_postdata(); ?>
        <?php else : ?>
            <p class="advanced-post-grid-preview__state--empty">
                <?php esc_html_e( 'No posts found for this category.', 'my-post-grid' ); ?>
            </p>
        <?php endif; ?>
    </div>
</div>