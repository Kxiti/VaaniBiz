/**
 * Tests for Task 3.2: Transform API response strings into Opportunity objects
 * 
 * This test file verifies that the getOpportunities function correctly transforms
 * API response strings into structured Opportunity objects with all required fields.
 */

import { getOpportunities } from '../api';
import { BusinessProfile, Opportunity } from '../types';

// Mock fetch globally
global.fetch = jest.fn();

describe('Task 3.2: Opportunity Transformation', () => {
  const mockProfile: BusinessProfile = {
    businessType: 'Retail Food Stall',
    targetMarket: 'College Students',
    estimatedScale: 'Small',
    location: 'Jhansi, Uttar Pradesh',
    requiredResources: ['Equipment', 'Supplies']
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should transform API response strings into Opportunity objects with all required fields', async () => {
    // Arrange
    const mockOpportunityStrings = [
      'Partner with local colleges for catering contracts. This could provide steady revenue.',
      'Expand menu to include healthy breakfast options targeting health-conscious students',
      'Short opportunity'
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ opportunities: mockOpportunityStrings })
    });

    // Act
    const result = await getOpportunities(mockProfile);

    // Assert
    expect(result).toHaveLength(3);
    
    // Verify each opportunity has all required fields
    result.forEach((opportunity: Opportunity) => {
      expect(opportunity).toHaveProperty('title');
      expect(opportunity).toHaveProperty('description');
      expect(opportunity).toHaveProperty('relevanceScore');
      expect(opportunity).toHaveProperty('timing');
      expect(opportunity).toHaveProperty('actionRequired');
      
      // Verify types
      expect(typeof opportunity.title).toBe('string');
      expect(typeof opportunity.description).toBe('string');
      expect(typeof opportunity.relevanceScore).toBe('number');
      expect(typeof opportunity.timing).toBe('string');
      expect(typeof opportunity.actionRequired).toBe('string');
      
      // Verify title is non-empty
      expect(opportunity.title.length).toBeGreaterThan(0);
    });
  });

  it('should set description to full opportunity string', async () => {
    // Arrange
    const mockOpportunityStrings = [
      'This is the full opportunity description that should be preserved exactly.'
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ opportunities: mockOpportunityStrings })
    });

    // Act
    const result = await getOpportunities(mockProfile);

    // Assert
    expect(result[0].description).toBe(mockOpportunityStrings[0]);
  });

  it('should set default values correctly', async () => {
    // Arrange
    const mockOpportunityStrings = ['Any opportunity string'];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ opportunities: mockOpportunityStrings })
    });

    // Act
    const result = await getOpportunities(mockProfile);

    // Assert - Verify default values as specified in requirements
    expect(result[0].relevanceScore).toBe(0.75);
    expect(result[0].timing).toBe('Upcoming');
    expect(result[0].actionRequired).toBe('Review and evaluate this opportunity');
  });

  it('should extract title from first sentence', async () => {
    // Arrange
    const mockOpportunityStrings = [
      'This is the first sentence. This is the second sentence.'
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ opportunities: mockOpportunityStrings })
    });

    // Act
    const result = await getOpportunities(mockProfile);

    // Assert
    expect(result[0].title).toBe('This is the first sentence.');
  });

  it('should truncate long strings without sentence boundaries', async () => {
    // Arrange
    const longString = 'A'.repeat(100); // 100 character string with no sentence boundary
    const mockOpportunityStrings = [longString];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ opportunities: mockOpportunityStrings })
    });

    // Act
    const result = await getOpportunities(mockProfile);

    // Assert
    expect(result[0].title).toBe('A'.repeat(50) + '...');
    expect(result[0].title.length).toBe(53); // 50 chars + '...'
  });

  it('should use full string as title for short strings', async () => {
    // Arrange
    const shortString = 'Short opportunity';
    const mockOpportunityStrings = [shortString];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ opportunities: mockOpportunityStrings })
    });

    // Act
    const result = await getOpportunities(mockProfile);

    // Assert
    expect(result[0].title).toBe(shortString);
  });

  it('should handle empty opportunities array', async () => {
    // Arrange
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ opportunities: [] })
    });

    // Act
    const result = await getOpportunities(mockProfile);

    // Assert
    expect(result).toEqual([]);
  });

  it('should transform multiple opportunities correctly', async () => {
    // Arrange
    const mockOpportunityStrings = [
      'First opportunity with sentence. More details here.',
      'Second opportunity description',
      'Third opportunity! Exciting stuff.'
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ opportunities: mockOpportunityStrings })
    });

    // Act
    const result = await getOpportunities(mockProfile);

    // Assert
    expect(result).toHaveLength(3);
    expect(result[0].title).toBe('First opportunity with sentence.');
    expect(result[0].description).toBe(mockOpportunityStrings[0]);
    expect(result[1].description).toBe(mockOpportunityStrings[1]);
    expect(result[2].title).toBe('Third opportunity!');
    
    // All should have default values
    result.forEach(opp => {
      expect(opp.relevanceScore).toBe(0.75);
      expect(opp.timing).toBe('Upcoming');
      expect(opp.actionRequired).toBe('Review and evaluate this opportunity');
    });
  });
});
