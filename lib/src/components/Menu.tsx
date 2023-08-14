import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { focusedMixin, paperMixin } from "../styles";
import { cn } from "./util/cn";

export type MenuProps = {
    children: React.ReactNode;
    trigger: React.ReactNode;
}

export function Menu({
                         children,
                         trigger
                     }: MenuProps) {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                {trigger}
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
                <DropdownMenu.Content className={cn(paperMixin, "shadow py-2 z-50")}
                                      // onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    {children}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}

export type MenuItemProps = {
    children: React.ReactNode;
    dense?: boolean;
    onClick?: (event: React.MouseEvent) => void;
}

export function MenuItem({
                             children,
                             dense,
                             onClick
                         }: MenuItemProps) {
    return (
        <DropdownMenu.Item
            className={cn(focusedMixin, "rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 flex items-center gap-4")}
            onClick={onClick}>
            {children}
        </DropdownMenu.Item>
    );
}
