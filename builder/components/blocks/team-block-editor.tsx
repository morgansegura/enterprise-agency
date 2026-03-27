"use client";
/* eslint-disable @next/next/no-img-element -- dynamic CMS images with unknown dimensions */

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Users, X, PlusCircle } from "lucide-react";
import { FormItem } from "@/components/ui/form";
import {
  ResponsiveField,
  useResponsiveChange,
} from "@/components/editor/responsive-field";
import {
  useCurrentBreakpoint,
  useCanSetResponsiveOverrides,
} from "@/lib/responsive/context";
import { getResponsiveValue } from "@/lib/responsive";

interface TeamMember {
  name: string;
  role: string;
  image?: string;
  bio?: string;
  social?: { platform: string; url: string }[];
}

interface TeamBlockData {
  _key: string;
  _type: "team-block";
  data: {
    members: TeamMember[];
    columns?: 2 | 3 | 4;
    variant?: "default" | "card" | "minimal";
    showBio?: boolean;
    showSocial?: boolean;
    _responsive?: {
      tablet?: Partial<
        Omit<TeamBlockData["data"], "_responsive" | "members">
      >;
      mobile?: Partial<
        Omit<TeamBlockData["data"], "_responsive" | "members">
      >;
    };
  };
}

interface TeamBlockEditorProps {
  block: TeamBlockData;
  onChange: (block: TeamBlockData) => void;
  onDelete: () => void;
}

export function TeamBlockEditor({
  block,
  onChange,
  onDelete,
}: TeamBlockEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState<number[]>([0]);
  const breakpoint = useCurrentBreakpoint();
  const canSetOverrides = useCanSetResponsiveOverrides();

  // Handle data changes with responsive support
  const handleDataChange = useResponsiveChange(block.data, (newData) =>
    onChange({ ...block, data: newData as TeamBlockData["data"] }),
  );

  // Direct handler for members (not responsive)
  const handleMembersChange = (members: TeamMember[]) => {
    onChange({
      ...block,
      data: {
        ...block.data,
        members,
      },
    });
  };

  const handleMemberChange = (
    index: number,
    field: keyof TeamMember,
    value: unknown,
  ) => {
    const updatedMembers = [...block.data.members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    handleMembersChange(updatedMembers);
  };

  const handleAddMember = () => {
    const updatedMembers = [
      ...block.data.members,
      { name: "", role: "", image: "", bio: "" },
    ];
    handleMembersChange(updatedMembers);
    setExpandedMembers((prev) => [...prev, updatedMembers.length - 1]);
  };

  const handleRemoveMember = (index: number) => {
    const updatedMembers = block.data.members.filter((_, i) => i !== index);
    handleMembersChange(updatedMembers);
  };

  const toggleMember = (index: number) => {
    setExpandedMembers((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index],
    );
  };

  // Get responsive-aware values
  const columns =
    getResponsiveValue<number>(block.data, "columns", breakpoint) || 3;
  const variant = block.data.variant || "default";
  const showBio = block.data.showBio ?? true;
  const showSocial = block.data.showSocial ?? false;

  const variantStyles = {
    default: "",
    card: "bg-card border rounded-lg p-4 shadow-sm",
    minimal: "text-center",
  };

  if (!isEditing) {
    return (
      <div
        className="group relative border-2 border-dashed border-border rounded-lg p-4 hover:border-primary cursor-pointer transition-colors"
        onClick={() => setIsEditing(true)}
      >
        <div
          className={`grid grid-cols-${columns} gap-4`}
        >
          {block.data.members.length === 0 ? (
            <div className="col-span-full text-center text-[var(--el-500)] py-4">
              No team members yet. Click to add members...
            </div>
          ) : (
            block.data.members.map((member, index) => (
              <div
                key={index}
                className={`text-center ${variantStyles[variant]}`}
              >
                {member.image && (
                  <div className="w-16 h-16 rounded-full bg-[var(--el-100)] mx-auto mb-2 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="font-semibold text-sm">
                  {member.name || "Name"}
                </div>
                <div className="text-xs text-[var(--el-500)]">
                  {member.role || "Role"}
                </div>
              </div>
            ))
          )}
        </div>
        <Button
          variant="destructive"
          size="icon-sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="border-2 border-primary rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Team Block
          {canSetOverrides && breakpoint !== "desktop" && (
            <span className="text-xs font-normal text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">
              Editing {breakpoint}
            </span>
          )}
        </h4>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsEditing(false)}>
            Done
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <FormItem className="flex items-center justify-between mb-2">
            <Label>Team Members</Label>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddMember}
            >
              <PlusCircle className="h-3 w-3 mr-1" />
              Add Member
            </Button>
          </FormItem>

          <div className="space-y-3">
            {block.data.members.map((member, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 space-y-2 bg-[var(--el-100)]/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <Button
                    type="button"
                    onClick={() => toggleMember(index)}
                    className="flex-1 text-left"
                  >
                    <div className="font-medium text-sm">
                      {member.name || `Member ${index + 1}`}
                    </div>
                    <div className="text-xs text-[var(--el-500)]">
                      {member.role || "No role set"}
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleRemoveMember(index)}
                    disabled={block.data.members.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {expandedMembers.includes(index) && (
                  <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <FormItem>
                        <Label htmlFor={`member-${index}-name`}>Name</Label>
                        <Input
                          id={`member-${index}-name`}
                          value={member.name}
                          onChange={(e) =>
                            handleMemberChange(index, "name", e.target.value)
                          }
                          placeholder="e.g., Jane Doe"
                        />
                      </FormItem>
                      <FormItem>
                        <Label htmlFor={`member-${index}-role`}>Role</Label>
                        <Input
                          id={`member-${index}-role`}
                          value={member.role}
                          onChange={(e) =>
                            handleMemberChange(index, "role", e.target.value)
                          }
                          placeholder="e.g., CEO"
                        />
                      </FormItem>
                    </div>
                    <FormItem>
                      <Label htmlFor={`member-${index}-image`}>
                        Image URL (Optional)
                      </Label>
                      <Input
                        id={`member-${index}-image`}
                        value={member.image || ""}
                        onChange={(e) =>
                          handleMemberChange(index, "image", e.target.value)
                        }
                        placeholder="https://example.com/photo.jpg"
                      />
                    </FormItem>
                    <FormItem>
                      <Label htmlFor={`member-${index}-bio`}>
                        Bio (Optional)
                      </Label>
                      <Textarea
                        id={`member-${index}-bio`}
                        value={member.bio || ""}
                        onChange={(e) =>
                          handleMemberChange(index, "bio", e.target.value)
                        }
                        placeholder="Short biography..."
                        rows={2}
                      />
                    </FormItem>
                    {member.social && member.social.length > 0 && (
                      <div className="space-y-1">
                        <Label className="text-xs text-[var(--el-500)]">
                          Social Links
                        </Label>
                        {member.social.map((link, linkIndex) => (
                          <div
                            key={linkIndex}
                            className="text-xs text-[var(--el-500)] flex gap-2"
                          >
                            <span className="font-medium">
                              {link.platform}:
                            </span>
                            <span className="truncate">{link.url}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {block.data.members.length === 0 && (
              <p className="text-sm text-[var(--el-500)] text-center py-4">
                No team members yet. Click &quot;Add Member&quot; to start.
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ResponsiveField
            fieldName="columns"
            data={block.data}
            onChange={(newData) =>
              onChange({ ...block, data: newData as TeamBlockData["data"] })
            }
            label="Columns"
          >
            <Select
              value={String(columns)}
              onValueChange={(value) =>
                handleDataChange("columns", Number(value))
              }
            >
              <SelectTrigger id="team-columns">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Columns</SelectItem>
                <SelectItem value="3">3 Columns</SelectItem>
                <SelectItem value="4">4 Columns</SelectItem>
              </SelectContent>
            </Select>
          </ResponsiveField>

          <FormItem>
            <Label htmlFor="team-variant">Style</Label>
            <Select
              value={variant}
              onValueChange={(value) => handleDataChange("variant", value)}
            >
              <SelectTrigger id="team-variant">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="minimal">Minimal</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="team-showbio"
              checked={showBio}
              onCheckedChange={(checked) =>
                handleDataChange("showBio", !!checked)
              }
            />
            <Label htmlFor="team-showbio" className="cursor-pointer">
              Show Bio
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="team-showsocial"
              checked={showSocial}
              onCheckedChange={(checked) =>
                handleDataChange("showSocial", !!checked)
              }
            />
            <Label htmlFor="team-showsocial" className="cursor-pointer">
              Show Social Links
            </Label>
          </div>
        </div>

        <div className="border rounded-lg p-4 bg-[var(--el-100)]/30">
          <p className="text-xs text-[var(--el-500)] mb-2">
            Preview ({breakpoint}):
          </p>
          <div className={`grid grid-cols-${columns} gap-4`}>
            {block.data.members.length === 0 ? (
              <div className="col-span-full text-center text-[var(--el-500)] py-4">
                No team members yet
              </div>
            ) : (
              block.data.members.map((member, index) => (
                <div
                  key={index}
                  className={`text-center ${variantStyles[variant]}`}
                >
                  {member.image && (
                    <div className="w-12 h-12 rounded-full bg-[var(--el-100)] mx-auto mb-1 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="font-semibold text-sm">
                    {member.name || "Name"}
                  </div>
                  <div className="text-xs text-[var(--el-500)]">
                    {member.role || "Role"}
                  </div>
                  {showBio && member.bio && (
                    <div className="text-xs text-[var(--el-500)] mt-1">
                      {member.bio}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
