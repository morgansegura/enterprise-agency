"use client";

import { UseFormReturn, FieldValues } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Section token form fields use nested paths that aren't in DesignTokens yet
// Using FieldValues allows dynamic nested paths until section tokens are properly typed
interface SectionTokenEditorProps {
  form: UseFormReturn<FieldValues>;
}

export function SectionTokenEditor({ form }: SectionTokenEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3">Section Spacing</h4>
        <p className="text-xs text-muted-foreground mb-4">
          Configure vertical spacing for different section sizes
        </p>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="section.spacing.md.top"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medium Top Spacing</FormLabel>
                <FormControl>
                  <Input
                    placeholder="4rem"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Top padding for md sections
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="section.spacing.md.bottom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Medium Bottom Spacing</FormLabel>
                <FormControl>
                  <Input
                    placeholder="4rem"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Bottom padding for md sections
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="section.spacing.lg.top"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Large Top Spacing</FormLabel>
                <FormControl>
                  <Input
                    placeholder="6rem"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Top padding for lg sections
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="section.spacing.lg.bottom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Large Bottom Spacing</FormLabel>
                <FormControl>
                  <Input
                    placeholder="6rem"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Bottom padding for lg sections
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Container Widths</h4>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="section.width.narrow"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Narrow Width</FormLabel>
                <FormControl>
                  <Input
                    placeholder="768px"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Narrow container width
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="section.width.container"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Container Width</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1280px"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Standard container width
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="section.width.wide"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wide Width</FormLabel>
                <FormControl>
                  <Input
                    placeholder="1536px"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Wide container width
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Background Colors</h4>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="section.background.primary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Background</FormLabel>
                <FormControl>
                  <Input
                    placeholder="var(--primary)"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Primary brand background
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="section.background.secondary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Background</FormLabel>
                <FormControl>
                  <Input
                    placeholder="var(--secondary)"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Secondary brand background
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="section.background.accent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Accent Background</FormLabel>
                <FormControl>
                  <Input
                    placeholder="var(--accent)"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Accent background color
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
