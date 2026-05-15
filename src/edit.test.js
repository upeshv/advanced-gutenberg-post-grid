/**
 * External dependencies
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Edit from './edit';

/**
 * Mock WordPress Data Store
 */
jest.mock( '@wordpress/data', () => ( {
	useSelect: jest.fn(),
} ) );

/**
 * Mock WordPress Element hooks and components
 */
jest.mock( '@wordpress/element', () => ( {
	RawHTML: ( { children } ) => <div data-testid="raw-html">{ children }</div>,
	useMemo: ( callback ) => callback(),
} ) );

/**
 * Mock native WP UI components
 */
jest.mock( '@wordpress/components', () => ( {
	PanelBody: ( { children } ) => <div data-testid="panel-body">{ children }</div>,
	RangeControl: ( { value, onChange, label } ) => (
		<input
			data-testid={ `range-control-${ label }` }
			aria-label={ label }
			type="range"
			value={ value }
			onChange={ ( e ) => onChange( Number( e.target.value ) ) }
		/>
	),
	SelectControl: ( { value, options, onChange, label } ) => (
		<select
			data-testid={ `select-control-${ label }` }
			aria-label={ label }
			value={ value }
			onChange={ ( e ) => onChange( e.target.value ) }
		>
			{ options &&
				options.map( ( option ) => (
					<option key={ option.value } value={ option.value }>
						{ option.label }
					</option>
				) ) }
		</select>
	),
	ToggleControl: ( { checked, onChange, label } ) => (
		<label>
			{ label }
			<input
				data-testid={ `toggle-control-${ label }` }
				type="checkbox"
				checked={ checked }
				onChange={ ( e ) => onChange( e.target.checked ) }
			/>
		</label>
	),
	Spinner: () => <div data-testid="spinner">Loading...</div>,
	Notice: ( { children } ) => <div data-testid="notice">{ children }</div>,
} ) );

/**
 * Mock WordPress Block Editor components
 */
jest.mock( '@wordpress/block-editor', () => ( {
	useBlockProps: () => ( { className: 'advanced-post-grid' } ),
	InspectorControls: ( { children } ) => <div data-testid="inspector">{ children }</div>,
} ) );

/**
 * Mock WordPress i18n
 */
jest.mock( '@wordpress/i18n', () => ( {
	__: ( text ) => text,
} ) );

describe( 'Advanced Post Grid - Edit Component', () => {
	const mockPosts = [
		{
			id: 1,
			title: { rendered: 'Sample Post Title' },
			excerpt: { rendered: '<p>An excerpt...</p>' },
			link: '#',
		},
	];

	const mockCategories = [
		{ id: 1, name: 'News' },
	];

	const defaultAttributes = {
		postCount: 3,
		columns: 3,
		categoryId: 0,
		orderBy: 'date',
		order: 'desc',
		displayImage: true,
	};

	beforeEach( () => {
		jest.clearAllMocks();
	} );

	it( 'renders the loading spinner when the data is resolving', () => {
		useSelect.mockReturnValue( {
			posts: null,
			hasResolved: false,
			apiError: false,
			categories: [],
		} );

		render( <Edit attributes={ defaultAttributes } setAttributes={ jest.fn() } /> );
		expect( screen.getByTestId( 'spinner' ) ).toBeInTheDocument();
	} );

	it( 'renders an error notice when the REST API fails', () => {
		useSelect.mockReturnValue( {
			posts: null,
			hasResolved: true,
			apiError: true,
			categories: [],
		} );

		render( <Edit attributes={ defaultAttributes } setAttributes={ jest.fn() } /> );
		expect( screen.getByText( /Error loading posts/i ) ).toBeInTheDocument();
	} );

	it( 'renders a grid of posts when the database returns data', () => {
		useSelect.mockReturnValue( {
			posts: mockPosts,
			hasResolved: true,
			apiError: false,
			categories: mockCategories,
		} );

		render( <Edit attributes={ defaultAttributes } setAttributes={ jest.fn() } /> );
		expect( screen.getByText( 'Sample Post Title' ) ).toBeInTheDocument();
		expect( screen.getByTestId( 'raw-html' ) ).toHaveTextContent( 'An excerpt...' );
	} );

	it( 'displays the empty state notice when no posts are found', () => {
		useSelect.mockReturnValue( {
			posts: [],
			hasResolved: true,
			apiError: false,
			categories: [],
		} );

		render( <Edit attributes={ defaultAttributes } setAttributes={ jest.fn() } /> );
		expect( screen.getByText( /No posts found matching this criteria/i ) ).toBeInTheDocument();
	} );

	it( 'triggers setAttributes when InspectorControls are changed', () => {
		const setAttributesMock = jest.fn();

		useSelect.mockReturnValue( {
			posts: [],
			hasResolved: true,
			apiError: false,
			categories: [],
		} );

		render( <Edit attributes={ defaultAttributes } setAttributes={ setAttributesMock } /> );

		// Trigger Range Control update (Number of Posts)
		const rangeInput = screen.getByTestId( 'range-control-Number of Posts' );
		fireEvent.change( rangeInput, { target: { value: '6' } } );
		expect( setAttributesMock ).toHaveBeenCalledWith( { postCount: 6 } );

		// Trigger Toggle Control update (Display Image)
		const toggleInput = screen.getByTestId( 'toggle-control-Show Featured Image' );
		fireEvent.click( toggleInput );
		expect( setAttributesMock ).toHaveBeenCalledWith( { displayImage: false } );
	} );
} );