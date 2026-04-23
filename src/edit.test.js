/**
 * External dependencies
 */
import { render, screen } from '@testing-library/react';
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

// Mocking native WP components to keep the DOM snapshot lightweight
jest.mock('@wordpress/components', () => ({
    PanelBody: ({ children }) => <div>{children}</div>,
    RangeControl: () => <div data-testid="range-control">Range Control</div>,
    SelectControl: () => <div data-testid="select-control">Select Control</div>,
    Spinner: () => <div data-testid="spinner">Loading...</div>,
    Notice: ({ children }) => <div data-testid="notice">{children}</div>,
}));

jest.mock('@wordpress/block-editor', () => ({
    useBlockProps: () => ({ className: 'wp-block-test-class' }),
    InspectorControls: ({ children }) => <div data-testid="inspector">{children}</div>,
}));


jest.mock('@wordpress/i18n', () => ({
    __: (text) => text,
}));

describe('Advanced Post Grid - Edit Component', () => {
    
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
            posts: [
                { id: 1, title: { rendered: 'Enterprise Architecture Post' }, excerpt: { rendered: 'An excerpt...' }, link: '#' }
            ],
            hasResolved: true,
            categories: [{ id: 1, name: 'News' }],
        });

        render(<Edit attributes={{ postCount: 3, categoryId: 0 }} setAttributes={jest.fn()} />);
        
        expect(screen.getByText('Enterprise Architecture Post')).toBeInTheDocument();
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
});