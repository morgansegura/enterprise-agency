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

// Header token form fields use nested paths that aren't in DesignTokens yet
// Using FieldValues allows dynamic nested paths until header tokens are properly typed
interface HeaderTokenEditorProps {
  form: UseFormReturn<FieldValues>;
}

export function HeaderTokenEditor({ form }: HeaderTokenEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3">Header Heights</h4>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="header.height.default"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Height</FormLabel>
                <FormControl>
                  <Input
                    placeholder="80px"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Default header height
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="header.height.shrunk"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shrunk Height</FormLabel>
                <FormControl>
                  <Input
                    placeholder="64px"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Height when scrolled
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="header.height.mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mobile Height</FormLabel>
                <FormControl>
                  <Input
                    placeholder="72px"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Height on mobile devices
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Header Backgrounds</h4>
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="header.background.default"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Default Background</FormLabel>
                <FormControl>
                  <Input
                    placeholder="#ffffff"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Default background color
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="header.background.scrolled"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scrolled Background</FormLabel>
                <FormControl>
                  <Input
                    placeholder="#ffffff"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Background when scrolled
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="header.background.transparent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transparent Background</FormLabel>
                <FormControl>
                  <Input
                    placeholder="transparent"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Transparent header option
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
