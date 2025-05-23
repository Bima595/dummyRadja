"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Option = {
  value: string
  label: string
}

interface MultiSelectProps {
  options: Option[]
  value: Option[]
  onChange: (value: Option[]) => void
}

export function MultiSelect({ options, value, onChange }: MultiSelectProps) {
  const handleSelect = (selectedValue: string) => {
    const option = options.find((opt) => opt.value === selectedValue)
    if (option && !value.some((item) => item.value === option.value)) {
      onChange([...value, option])
    }
  }

  const handleUnselect = (optionToRemove: Option) => {
    onChange(value.filter((item) => item.value !== optionToRemove.value))
  }

  const availableOptions = options.filter(
    (option) => !value.some((item) => item.value === option.value)
  )

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 min-h-[2.5rem] p-2 border rounded-md">
        {value.map((option) => (
          <Badge key={option.value} variant="secondary">
            {option.label}
            <button
              type="button"
              className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => handleUnselect(option)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">Remove</span>
            </button>
          </Badge>
        ))}
      </div>
      {availableOptions.length > 0 && (
        <Select onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Add user..." />
          </SelectTrigger>
          <SelectContent>
            {availableOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
} 