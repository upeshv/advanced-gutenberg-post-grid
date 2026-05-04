<?php
// This file is generated. Do not modify it manually.
return array(
	'build' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'advanced-post-grid/grid',
		'version' => '0.1.0',
		'title' => 'Advanced Post Grid',
		'category' => 'widgets',
		'icon' => 'grid-view',
		'description' => 'A dynamic React-powered post grid for enterprise filtering.',
		'keywords' => array(
			'posts',
			'grid',
			'query'
		),
		'example' => array(
			'attributes' => array(
				'postCount' => 3,
				'columns' => 3,
				'displayImage' => true
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'attributes' => array(
			'postCount' => array(
				'type' => 'number',
				'default' => 3
			),
			'columns' => array(
				'type' => 'number',
				'default' => 3
			),
			'categoryId' => array(
				'type' => 'number',
				'default' => 0
			),
			'orderBy' => array(
				'type' => 'string',
				'default' => 'date'
			),
			'order' => array(
				'type' => 'string',
				'default' => 'desc'
			),
			'displayImage' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'textdomain' => 'advanced-post-grid',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	)
);
