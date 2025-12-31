"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface PageOption {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  isHomePage?: boolean;
}

interface PagePickerProps {
  pages: PageOption[];
  value: string | null;
  onChange: (pageId: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  showAllPages?: boolean;
  allowNone?: boolean;
  noneLabel?: string;
  className?: string;
}

export function PagePicker({
  pages,
  value,
  onChange,
  placeholder = "Select a page...",
  emptyMessage = "No pages found.",
  disabled = false,
  showAllPages = true,
  allowNone = true,
  noneLabel = "No homepage (Coming Soon page)",
  className,
}: PagePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const selectedPage = pages.find((page) => page.id === value);

  // Filter pages based on search
  const filteredPages = React.useMemo(() => {
    if (!search) return pages;
    const lowerSearch = search.toLowerCase();
    return pages.filter(
      (page) =>
        page.title.toLowerCase().includes(lowerSearch) ||
        page.slug.toLowerCase().includes(lowerSearch),
    );
  }, [pages, search]);

  // Group pages by status
  const publishedPages = filteredPages.filter((p) => p.status === "published");
  const draftPages = filteredPages.filter((p) => p.status === "draft");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !value && "text-muted-foreground",
            className,
          )}
        >
          {selectedPage ? (
            <span className="flex items-center gap-2 truncate">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{selectedPage.title}</span>
              <span className="text-xs text-muted-foreground">
                /{selectedPage.slug}
              </span>
            </span>
          ) : value === "none" || !value ? (
            <span className="text-muted-foreground">{noneLabel}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search pages..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>

            {allowNone && (
              <CommandGroup>
                <CommandItem
                  value="none"
                  onSelect={() => {
                    onChange("none");
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === "none" || !value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="text-muted-foreground">{noneLabel}</span>
                </CommandItem>
              </CommandGroup>
            )}

            {publishedPages.length > 0 && (
              <>
                {allowNone && <CommandSeparator />}
                <CommandGroup heading="Published">
                  {publishedPages.map((page) => (
                    <CommandItem
                      key={page.id}
                      value={page.id}
                      onSelect={() => {
                        onChange(page.id);
                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === page.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-green-600" />
                        <span className="truncate font-medium">
                          {page.title}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          /{page.slug}
                        </span>
                        {page.isHomePage && (
                          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded shrink-0">
                            Current
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {showAllPages && draftPages.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Drafts">
                  {draftPages.map((page) => (
                    <CommandItem
                      key={page.id}
                      value={page.id}
                      onSelect={() => {
                        onChange(page.id);
                        setOpen(false);
                        setSearch("");
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === page.id ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 shrink-0 text-yellow-600" />
                        <span className="truncate font-medium">
                          {page.title}
                        </span>
                        <span className="text-xs text-muted-foreground shrink-0">
                          /{page.slug}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
