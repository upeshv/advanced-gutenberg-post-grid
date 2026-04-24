/**
 * External dependencies
 */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

/**
 * Internal dependencies
 */
import Edit from './edit';
import { useSelect } from '@wordpress/data';

/**
 * Mocking WordPress Data Store
 */
jest.mock('@wordpress/data', () => ({
    useSelect: jest.fn(),
}));

/**
 * Mocking WordPress Element (Specifically RawHTML to prevent test crashes)
 */
jest.mock('@wordpress/element', () => ({
    RawHTML: ({ children }) => <div data-testid="raw-html">{children}</div>,
}));

/**
 * Mocking native WP components to keep the DOM snapshot lightweight 
 * and allow for interaction testing.
 */
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }) => <div data-testid="panel-body">{children}</div>,
    // Upgraded mock to an actual input so we can fire change events
    RangeControl: ({ value, onChange }) => (
        <input 
            data-testid="range-control" 
            type="range" 
            value={value} 
            onChange={(e) => onChange(Number(e.target.value))} 
        />
    ),
    SelectControl: ({ value, options, onChange }) => (
        <select 
            data-testid="select-control" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
        >
            {/* Dynamically render whatever options the edit.js component passes to this mock */}
            {options && options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    ),
    Spinner: () => <div data-testid="spinner">Loading...</div>,
    Notice: ({ children }) => <div data-testid="notice">{children}</div>,
}));

jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: () => ({ className: 'advanced-post-grid-preview' }),
    InspectorControls: ({ children }) => <div data-testid="inspector">{children}</div>,
}));


jest.mock('@wordpress/i18n', () => ({
    __: (text) => text,
}));

describe('Advanced Post Grid - Edit Component', () => {
    
    // A single source of truth for our mock data.
    const mockPosts = [
        { 
            id: 1, 
            title: { rendered: 'Enterprise Architecture Post' }, 
            excerpt: { rendered: '<p>An excerpt...</p>' }, 
            link: '#' 
        }
    ];

    const mockCategories = [
        { id: 1, name: 'News' }
    ];

    // Reset mocks before each test to prevent data leakage
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the loading spinner when the database is resolving', () => {
        // Simulate the "loading" state from the REST API
        useSelect.mockReturnValue({
            posts: null,
            hasResolved: false,
            categories: [],
        });

        render(<Edit attributes={{ postCount: 3, categoryId: 0 }} setAttributes={jest.fn()} />);

        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    it('renders a grid of posts when the database returns data', () => {
        // Simulate a successful database response
        useSelect.mockReturnValue({
            posts: mockPosts, // Using fixture
            hasResolved: true,
            categories: mockCategories, // Using fixture
        });

        render(<Edit attributes={{ postCount: 3, categoryId: 0 }} setAttributes={jest.fn()} />);
        
        expect(screen.getByText('Enterprise Architecture Post')).toBeInTheDocument();
        expect(screen.getByTestId('raw-html')).toHaveTextContent('An excerpt...');
    });

    it('displays the empty state notice when no posts are found', () => {
        // Simulate an empty database response
        useSelect.mockReturnValue({
            posts: [],
            hasResolved: true,
            categories: [],
        });

        render(<Edit attributes={{ postCount: 3, categoryId: 0 }} setAttributes={jest.fn()} />);
        
        expect(screen.getByText('No posts found for this category.')).toBeInTheDocument();
    });

    it('triggers setAttributes when InspectorControls are changed', () => {
        // Mocking setAttributes so we can test on runtime
        const setAttributesMock = jest.fn();
        
        useSelect.mockReturnValue({
            posts: [],
            hasResolved: true,
            categories: [],
        });

        render(<Edit attributes={{ postCount: 3, categoryId: 0 }} setAttributes={setAttributesMock} />);
        
        // Find the range control input
        const rangeInput = screen.getByTestId('range-control');
        
        // Simulate a user dragging the slider to '6'
        fireEvent.change(rangeInput, { target: { value: '6' } });
        
        // Assert that our component successfully requested a Redux state update
        expect(setAttributesMock).toHaveBeenCalledWith({ postCount: 6 });
    });
});