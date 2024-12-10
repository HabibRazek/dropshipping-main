"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { getStoreById, getStoresBySellerId } from "@/actions/store.actions"
import useCart from "@/hooks/use-cart"

interface StoreSwitcherProps {
    stores: Awaited<ReturnType<typeof getStoresBySellerId>>;
}

export function StoreSwitcher({ stores } : StoreSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const { storeId, setStoreId } = useCart();
  const formattedStores = stores?.map((store) => ({
    label: store?.name,
    value: store?.id
  }));



  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {storeId
            ? formattedStores.find((formatedstore) => formatedstore.value === storeId)?.label
            : "Select Store..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search store..." />
          <CommandEmpty>No store found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
            {formattedStores?.map((formatedstore) => (
              <CommandItem
                key={formatedstore.value}
                value={formatedstore.label}
                onSelect={(currentValue) => {
                  const selectedvalue = formattedStores.find(
                    (formatedstore) => formatedstore.label!.toLowerCase() === currentValue.toLowerCase(),
                  )?.value;
                  setStoreId(storeId === selectedvalue ? "" : selectedvalue ?? "");
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    storeId === formatedstore.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {formatedstore.label}
              </CommandItem>
            ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
