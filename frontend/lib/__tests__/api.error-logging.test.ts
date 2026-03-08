/**
 * Tests for Task 5.1: Add console.error logging for all error scenarios
 * 
 * This test file verifies that the getOpportunities function logs appropriate
 * error messages for all error conditions:
 * - Network errors
 * - HTTP errors (non-200 status codes)
 * - JSON parse errors
 * - Schema validation failures (missing opportunities field)
 */

import { getOpportunities } from '../api';
import { BusinessProfile } from '../types';

// Mock fetch globally
global.fetch = jest.fn();

describe('Task 5.1: Error Logging', () => {
  const mockProfile: BusinessProfile = {
    businessType: 'Retail Food Stall',
    targetMarket: 'College Students',
    estimatedScale: 'Small',
    location: 'Jhansi, Uttar Pradesh',
    requiredResources: ['Equipment', 'Supplies']
  };

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on console.error to verify logging
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('Network Error Logging', () => {
    it('should log network errors with error message and details', async () => {
      // Arrange
      const networkError = new Error('Network connection failed');
      (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

      // Act
      const result = await getOpportunities(mockProfile);

      // Assert
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Opportunities API Error:',
        expect.objectContaining({
          type: 'NETWORK_ERROR',
          message: 'Network connection failed',
          url: expect.any(String)
        })
      );
    });

    it('should log network errors with stack trace', async () => {
      // Arrange
      const networkError = new Error('Connection timeout');
      (global.fetch as jest.Mock).mockRejectedValueOnce(networkError);

      // Act
      await getOpportunities(mockProfile);

      // Assert
      const loggedError = consoleErrorSpy.mock.calls[0][1];
      expect(loggedError.error).toBeDefined();
      expect(typeof loggedError.error).toBe('string'); // Stack trace is a string
    });
  });

  describe('HTTP Error Logging', () => {
    it('should log HTTP errors with status code and statusText', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      // Act
      const result = await getOpportunities(mockProfile);

      // Assert
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Opportunities API Error:',
        expect.objectContaining({
          type: 'HTTP_ERROR',
          status: 500,
          statusText: 'Internal Server Error',
          url: expect.any(String)
        })
      );
    });

    it('should log 404 errors correctly', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });

      // Act
      await getOpportunities(mockProfile);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Opportunities API Error:',
        expect.objectContaining({
          type: 'HTTP_ERROR',
          status: 404,
          statusText: 'Not Found'
        })
      );
    });

    it('should log 403 errors correctly', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden'
      });

      // Act
      await getOpportunities(mockProfile);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Opportunities API Error:',
        expect.objectContaining({
          type: 'HTTP_ERROR',
          status: 403,
          statusText: 'Forbidden'
        })
      );
    });
  });

  describe('JSON Parse Error Logging', () => {
    it('should log JSON parse errors', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Unexpected token < in JSON at position 0');
        }
      });

      // Act
      const result = await getOpportunities(mockProfile);

      // Assert
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Opportunities API Error:',
        expect.objectContaining({
          type: 'JSON_PARSE_ERROR',
          message: 'Failed to parse API response as JSON',
          error: 'Unexpected token < in JSON at position 0',
          url: expect.any(String)
        })
      );
    });

    it('should log parse errors with context', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new SyntaxError('Invalid JSON');
        }
      });

      // Act
      await getOpportunities(mockProfile);

      // Assert
      const loggedError = consoleErrorSpy.mock.calls[0][1];
      expect(loggedError.type).toBe('JSON_PARSE_ERROR');
      expect(loggedError.message).toBe('Failed to parse API response as JSON');
      expect(loggedError.url).toBeDefined();
    });
  });

  describe('Schema Validation Error Logging', () => {
    it('should log schema validation failures when opportunities field is missing', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'some other data' })
      });

      // Act
      const result = await getOpportunities(mockProfile);

      // Assert
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Opportunities API Error:',
        expect.objectContaining({
          type: 'SCHEMA_ERROR',
          message: 'Response missing "opportunities" array field',
          receivedData: { data: 'some other data' },
          url: expect.any(String)
        })
      );
    });

    it('should log schema validation failures when opportunities is not an array', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ opportunities: 'not an array' })
      });

      // Act
      const result = await getOpportunities(mockProfile);

      // Assert
      expect(result).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Opportunities API Error:',
        expect.objectContaining({
          type: 'SCHEMA_ERROR',
          message: 'Response missing "opportunities" array field',
          receivedData: { opportunities: 'not an array' }
        })
      );
    });

    it('should log schema validation failures when opportunities is null', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ opportunities: null })
      });

      // Act
      await getOpportunities(mockProfile);

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Opportunities API Error:',
        expect.objectContaining({
          type: 'SCHEMA_ERROR',
          receivedData: { opportunities: null }
        })
      );
    });
  });

  describe('Error Type and Context Verification', () => {
    it('should include error type in all logs', async () => {
      // Test network error
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
      await getOpportunities(mockProfile);
      expect(consoleErrorSpy.mock.calls[0][1].type).toBe('NETWORK_ERROR');

      consoleErrorSpy.mockClear();

      // Test HTTP error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Error'
      });
      await getOpportunities(mockProfile);
      expect(consoleErrorSpy.mock.calls[0][1].type).toBe('HTTP_ERROR');

      consoleErrorSpy.mockClear();

      // Test parse error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Parse error'); }
      });
      await getOpportunities(mockProfile);
      expect(consoleErrorSpy.mock.calls[0][1].type).toBe('JSON_PARSE_ERROR');

      consoleErrorSpy.mockClear();

      // Test schema error
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      });
      await getOpportunities(mockProfile);
      expect(consoleErrorSpy.mock.calls[0][1].type).toBe('SCHEMA_ERROR');
    });

    it('should include relevant context in all error logs', async () => {
      // Arrange
      const testCases = [
        {
          name: 'network error',
          mock: () => (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Test')),
          expectedContext: ['type', 'message', 'url']
        },
        {
          name: 'HTTP error',
          mock: () => (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Error'
          }),
          expectedContext: ['type', 'status', 'statusText', 'url']
        },
        {
          name: 'parse error',
          mock: () => (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => { throw new Error('Parse'); }
          }),
          expectedContext: ['type', 'message', 'error', 'url']
        },
        {
          name: 'schema error',
          mock: () => (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({})
          }),
          expectedContext: ['type', 'message', 'receivedData', 'url']
        }
      ];

      // Act & Assert
      for (const testCase of testCases) {
        consoleErrorSpy.mockClear();
        testCase.mock();
        await getOpportunities(mockProfile);
        
        const loggedData = consoleErrorSpy.mock.calls[0][1];
        testCase.expectedContext.forEach(key => {
          expect(loggedData).toHaveProperty(key);
        });
      }
    });
  });

  describe('No Logging for Successful Requests', () => {
    it('should not log errors when request is successful', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ opportunities: ['Test opportunity'] })
      });

      // Act
      await getOpportunities(mockProfile);

      // Assert
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('should not log errors for empty but valid responses', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ opportunities: [] })
      });

      // Act
      await getOpportunities(mockProfile);

      // Assert
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });
  });
});
