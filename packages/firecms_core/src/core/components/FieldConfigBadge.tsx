import { getIconForWidget } from "../util";
import { FieldConfig } from "../../types";

export function FieldConfigBadge({ fieldConfig }: { fieldConfig: FieldConfig | undefined }): React.ReactNode {
    const classes = "h-8 w-8 p-1 rounded-full shadow text-white";

    return <div
        className={classes}
        style={{
            background: fieldConfig?.color ?? "#888"
        }}>
        {getIconForWidget(fieldConfig, "medium")}
    </div>
}
