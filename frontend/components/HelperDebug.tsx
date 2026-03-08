"use client";

import { getActionHelpers } from "@/lib/actionHelpers";

/**
 * Debug component to test helper system
 * Add this to any page to verify helpers are working
 */
export default function HelperDebug() {
  const testCases = [
    "Find a Good Location",
    "Create Marketing Materials",
    "Register Your Business",
    "Plan Your Budget",
    "Design Your Logo",
    "Find Suppliers",
    "Hire Staff",
    "Create Social Media Presence",
  ];

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-2xl max-w-md max-h-96 overflow-auto z-50 border-2 border-primary">
      <h3 className="font-bold text-lg mb-3 text-primary">
        🔧 Helper System Debug
      </h3>
      <div className="space-y-3 text-sm">
        {testCases.map((testCase) => {
          const helpers = getActionHelpers(testCase, "");
          return (
            <div key={testCase} className="border-b pb-2">
              <p className="font-semibold text-gray-800">{testCase}</p>
              <p className="text-gray-600">
                Found: {helpers.length} helper{helpers.length !== 1 ? "s" : ""}
              </p>
              {helpers.map((h) => (
                <p key={h.id} className="text-xs text-gray-500 ml-2">
                  {h.icon} {h.title}
                </p>
              ))}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          const debug = document.querySelector("[data-helper-debug]");
          if (debug) debug.remove();
        }}
        className="mt-3 w-full px-3 py-2 bg-red-500 text-white rounded text-sm"
      >
        Close Debug
      </button>
    </div>
  );
}
