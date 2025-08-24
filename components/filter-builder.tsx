"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, X } from "lucide-react";
import { ColumnConfig } from "./dynamic-table";
import { tFilterCriteria, tFilterGroup, tFilterNode } from "@/util/util-type";

const OPERATORS = {
  string: [
    { value: "=", label: "Equals" },
    { value: "!=", label: "Not Equals" },
    { value: "contains", label: "Contains" },
    { value: "starts_with", label: "Starts With" },
    { value: "ends_with", label: "Ends With" },
  ],
  number: [
    { value: "=", label: "Equals" },
    { value: "!=", label: "Not Equals" },
    { value: "greater_than", label: "Greater Than" },
    { value: "less_than", label: "Less Than" },
    { value: ">=", label: "Greater Than or Equal" },
    { value: "<=", label: "Less Than or Equal" },
  ],
  date: [
    { value: "=", label: "Equals" },
    { value: "!=", label: "Not Equals" },
    { value: "after", label: "After" },
    { value: "before", label: "Before" },
  ],
  boolean: [
    { value: "=", label: "Equals" },
    { value: "not_equal", label: "Not Equals" },
  ],
};

const LOGICAL_OPERATORS = [
  { value: "and", label: "AND" },
  { value: "or", label: "OR" },
];

interface FilterCondition {
  field: string;
  operator: string;
  value: string;
  id: string;
}

interface DropdownState {
  show: boolean;
  type: "field" | "operator" | "logical";
  position: number;
  options: any[];
  fieldType?: string;
}

function FilterBuilder({ columns }: { columns: ColumnConfig[] }) {
  const [input, setInput] = useState("");
  const [dropdown, setDropdown] = useState<DropdownState>({
    show: false,
    type: "field",
    position: 0,
    options: [],
  });
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [error, setError] = useState("");
  const [cursorPosition, setCursorPosition] = useState(0);
  const [currentField, setCurrentField] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [filterCritreia, setFilterCriteria] = useState<tFilterCriteria[]>([]);
  const [currentFilterCriteria, setCurrentFilterCriteria] = useState<tFilterCriteria>({
    field: "",
    operator: "equals",
    value: "",
  });
  // Parse the input to extract filter conditions
  const parseFilters = (inputText: string): FilterCondition[] => {
    const conditions: FilterCondition[] = [];
    const regex =
      /(\w+)\s*(=|!=|>=|<=|greater_than|less_than|contains|starts_with|ends_with|after|before|not_equal)\s*['"]?([^'")]+)['"]?/g;
    let match;
    let id = 1;

    while ((match = regex.exec(inputText)) !== null) {
      conditions.push({
        field: match[1],
        operator: match[2],
        value: match[3].trim(),
        id: `filter_${id++}`,
      });
    }

    return conditions;
  };

  // Validate bracket syntax
  const validateBrackets = (text: string): boolean => {
    let count = 0;
    for (const char of text) {
      if (char === "(") count++;
      if (char === ")") count--;
      if (count < 0) return false;
    }
    return count === 0;
  };

  // Handle input changes
  const handleInputChange = (value: string) => {
    setInput(value);
    setError("");
    debugger;
    // Get cursor position
    const position = inputRef.current?.selectionStart || 0;
    setCursorPosition(position);

    // Check if we should show dropdown
    const charAtCursor = value[position - 1];
    const textBeforeCursor = value.substring(0, position);

    if (charAtCursor === "(") {
      // Show field dropdown
      setDropdown({
        show: true,
        type: "field",
        position,
        options: columns,
      });
      setCurrentField(null);
    } else {
      // Check if we just completed a field selection and need operator
      const fieldMatch = textBeforeCursor.match(/\((\w+)\s*$/);
      if (fieldMatch) {
        const fieldName = fieldMatch[1];
        const field = columns.find((f) => f.key === fieldName);

        if (field && fieldName !== currentField) {
          setCurrentField(fieldName);
          setDropdown({
            show: true,
            type: "operator",
            position,
            options: OPERATORS[field.type as keyof typeof OPERATORS] || [],
            fieldType: field.type,
          });
        }
      }
      // Check if we need logical operator dropdown after completed conditions
      else if (textBeforeCursor.match(/\)\s*$/) || textBeforeCursor.match(/['"][^'"]*['"]\s*$/)) {
        setDropdown({
          show: true,
          type: "logical",
          position,
          options: LOGICAL_OPERATORS,
        });
        setCurrentField(null);
      } else {
        // Hide dropdown if none of the conditions match
        setDropdown((prev) => ({ ...prev, show: false }));
      }
    }

    // Validate brackets
    if (!validateBrackets(value)) {
      setError("Incorrect filter: Mismatched parentheses");
    }

    // Parse and update filters
    const parsedFilters = parseFilters(value);
    setFilters(parsedFilters);
  };

  // Handle dropdown selection
  const handleDropdownSelect = (option: any) => {
    debugger;
    const beforeCursor = input.substring(0, cursorPosition);
    const afterCursor = input.substring(cursorPosition);

    let newInput = "";
    let newCursorPosition = cursorPosition;

    if (dropdown.type === "field") {
      newInput = beforeCursor + option.key + " " + afterCursor;
      newCursorPosition = cursorPosition + option.key.length + 1;
      setDropdown({
        show: true,
        type: "logical",
        position: newCursorPosition,
        options: LOGICAL_OPERATORS,
      });
    } else if (dropdown.type === "operator") {
      newInput = beforeCursor + option.value + ' "' + afterCursor;
      newCursorPosition = cursorPosition + option.value.length + 2;
      setDropdown((prev) => ({
        ...prev,
        show: false,
      }));
    } else if (dropdown.type === "logical") {
      newInput = beforeCursor + option.value + " (" + afterCursor;
      newCursorPosition = cursorPosition + option.value.length + 2;
      setDropdown((prev) => ({
        ...prev,
        show: false,
      }));
    }
    setInput(newInput);

    if (dropdown.type === "operator") {
      handleInputChange(afterCursor);
    }

    // Focus back to input and set cursor position
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  };

  // Clear all filters
  const clearFilters = () => {
    setInput("");
    setFilters([]);
    setError("");
    setDropdown((prev) => ({ ...prev, show: false }));
  };

  // Remove specific filter
  const removeFilter = (filterId: string) => {
    const updatedFilters = filters.filter((f) => f.id !== filterId);
    setFilters(updatedFilters);
    // Note: In a real implementation, you'd also update the input text
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Start typing with '(' to build your filter..."
              className={`font-mono ${error ? "border-destructive" : ""}`}
            />

            {/* Dropdown */}
            {dropdown.show && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-popover border rounded-md shadow-lg max-h-48 overflow-y-auto">
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b bg-muted/50">
                  {dropdown.type === "field" && "Select Field"}
                  {dropdown.type === "operator" && `Select Operator for ${currentField}`}
                  {dropdown.type === "logical" && "Select Logical Operator"}
                </div>
                {dropdown.options.map((option, index) => (
                  <button
                    key={index}
                    className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground text-sm"
                    onClick={() => handleDropdownSelect(option)}
                  >
                    <div className="font-medium">{option.label || option.key}</div>
                    {option.type && (
                      <div className="text-xs text-muted-foreground">{option.type}</div>
                    )}
                    {dropdown.type === "operator" && option.value && (
                      <div className="text-xs text-muted-foreground">({option.value})</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Clear button */}
          {input && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FilterBuilder;
