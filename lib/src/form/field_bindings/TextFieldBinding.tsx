import React, { useCallback } from "react";


import { FieldProps, PreviewType } from "../../types";
import { FieldHelperText, LabelWithIcon } from "../components";
import { useClearRestoreValue } from "../../hooks";
import { getIconForProperty } from "../../core";
import { IconButton, TextField } from "../../components";
import { PropertyPreview } from "../../preview";
import { Collapse } from "../../components/Collapse";
import { ClearIcon } from "../../icons/ClearIcon";

interface TextFieldProps<T extends string | number> extends FieldProps<T> {
    allowInfinity?: boolean
}

/**
 * Generic text field.
 * This is one of the internal components that get mapped natively inside forms
 * and tables to the specified properties.
 * @category Form fields
 */
export function TextFieldBinding<T extends string | number>({
                                                                propertyKey,
                                                                value,
                                                                setValue,
                                                                error,
                                                                showError,
                                                                disabled,
                                                                autoFocus,
                                                                property,
                                                                includeDescription,
                                                            }: TextFieldProps<T>) {

    let multiline: boolean | undefined;
    let url: boolean | PreviewType | undefined;
    if (property.dataType === "string") {
        multiline = property.multiline;
        url = property.url;
    }

    useClearRestoreValue({
        property,
        value,
        setValue
    });

    const handleClearClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setValue(null);
    }, [setValue]);

    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (inputType === "number") {
            const numberValue = event.target.value ? parseFloat(event.target.value) : undefined;
            if (numberValue && isNaN(numberValue)) {
                setValue(null);
            } else if (numberValue !== undefined && numberValue !== null) {
                setValue(numberValue as T);
            } else {
                setValue(null);
            }
        } else {
            setValue(event.target.value as T);
        }
    };

    const isMultiline = Boolean(multiline);

    const inputType = property.dataType === "number" ? "number" : undefined;
    return (
        <>
            <TextField
                value={value}
                onChange={onChange}
                autoFocus={autoFocus}
                label={<LabelWithIcon icon={getIconForProperty(property)}
                                      required={property.validation?.required}
                                      title={property.name}/>}
                type={inputType}
                multiline={isMultiline}
                disabled={disabled}
                endAdornment={
                    property.clearable && <IconButton
                        onClick={handleClearClick}>
                        <ClearIcon/>
                    </IconButton>
                }
                error={showError ? error : undefined}
                inputClassName={error ? "text-red-500 dark:text-red-600" : ""}/>

            <FieldHelperText includeDescription={includeDescription}
                             showError={showError}
                             error={error}
                             disabled={disabled}
                             property={property}/>

            {url && <Collapse
                className="mt-1 ml-1"
                in={Boolean(value)}>
                <PropertyPreview value={value}
                                 property={property}
                                 size={"medium"}/>
            </Collapse>}

        </>
    );

}
