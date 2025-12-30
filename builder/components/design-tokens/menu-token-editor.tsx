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

// Menu token form fields use nested paths that aren't in DesignTokens yet
// Using FieldValues allows dynamic nested paths until menu tokens are properly typed
interface MenuTokenEditorProps {
  form: UseFormReturn<FieldValues>;
}

export function MenuTokenEditor({ form }: MenuTokenEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3">Menu Item Typography</h4>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="menu.item.fontSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font Size</FormLabel>
                <FormControl>
                  <Input
                    placeholder="0.875rem"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Menu item font size
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="menu.item.fontWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font Weight</FormLabel>
                <FormControl>
                  <Input
                    placeholder="500"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Menu item font weight
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Menu Colors</h4>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="menu.color.default"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Color</FormLabel>
                <FormControl>
                  <Input
                    placeholder="#000000"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Default menu link color
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="menu.color.hover"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hover Color</FormLabel>
                <FormControl>
                  <Input
                    placeholder="#666666"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Menu link hover color
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="menu.color.active"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active Color</FormLabel>
                <FormControl>
                  <Input
                    placeholder="#4f46e5"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Active menu link color
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
