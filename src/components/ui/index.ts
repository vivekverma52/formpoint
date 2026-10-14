/**
 * FormPoint UI primitives. Domain-agnostic: nothing here knows about colleges.
 * Client components are marked "use client" in their own files, so importing
 * from this barrel keeps server components server-only.
 */
export { Badge, ChanceBadge, LiveBadge, type BadgeProps } from "./Badge";
export { Button, IconButton, type ButtonProps, type ButtonVariant, type IconButtonProps } from "./Button";
export { Card, IconTile, type CardProps } from "./Card";
export { Chip, ChipLink, type ChipProps } from "./Chip";
export { Dialog, type DialogProps } from "./Dialog";
export { Input, Select, type InputProps, type SelectProps } from "./Field";
export { Icon, type IconName, type IconProps } from "./Icon";
export { Breadcrumbs, Container, EmptyState, PageHeader, Section, Skeleton, Stat, type Crumb, type SectionProps, type StatProps } from "./Layout";
export { Rail, type RailProps } from "./Rail";
export { Segmented, type SegmentedOption, type SegmentedProps } from "./Segmented";
export { StarDefs, Stars, type StarsProps } from "./Stars";
export { ThemeToggle, themeInitScript } from "./ThemeToggle";
export { ToastProvider, useToast } from "./Toast";
