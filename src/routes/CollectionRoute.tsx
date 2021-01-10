import React from "react";
import { Entity, EntityCollectionView, EntitySchema } from "../models";
import { BreadcrumbEntry } from "./navigation";
import { createStyles, makeStyles, Typography } from "@material-ui/core";
import { useRouteMatch } from "react-router-dom";
import { useBreadcrumbsContext } from "../contexts";
import { CollectionTable } from "../collection/CollectionTable";
import { useSelectedEntityContext } from "../side_dialog/SelectedEntityContext";
import { createFormField } from "../form/form_factory";

export const useStyles = makeStyles(() =>
    createStyles({
        root: {
            height: "100%",
            display: "flex",
            flexDirection: "column"
        }
    })
);

interface CollectionRouteProps<S extends EntitySchema> {
    view: EntityCollectionView<S>;
    collectionPath: string;
    breadcrumbs: BreadcrumbEntry[];
}

export function CollectionRoute<S extends EntitySchema>({
                                                            view,
                                                            collectionPath,
                                                            breadcrumbs
                                                        }
                                                            : CollectionRouteProps<S>) {

    const { url } = useRouteMatch();


    const breadcrumbsContext = useBreadcrumbsContext();
    React.useEffect(() => {
        breadcrumbsContext.set({
            breadcrumbs: breadcrumbs
        });
    }, [url]);

    const selectedEntityContext = useSelectedEntityContext();

    const onEntityClick = (collectionPath: string, entity: Entity<S>) => {
        selectedEntityContext.open({
            entityId: entity.id,
            collectionPath
        });
    };

    const deleteEnabled = view.deleteEnabled === undefined || view.deleteEnabled;
    const editEnabled = view.editEnabled === undefined || view.editEnabled;
    const inlineEditing = editEnabled && (view.inlineEditing === undefined || view.inlineEditing);

    const classes = useStyles();

    const onNewClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        return selectedEntityContext.open({ collectionPath });
    };

    const title = (
        <React.Fragment>
            <Typography variant="h6">
                {`${view.schema.name} list`}
            </Typography>
            <Typography variant={"caption"} color={"textSecondary"}>
                {`/${collectionPath}`}
            </Typography>
        </React.Fragment>
    );

    return (
        <div className={classes.root}>

            <CollectionTable collectionPath={collectionPath}
                             schema={view.schema}
                             onNewClick={onNewClick}
                             textSearchDelegate={view.textSearchDelegate}
                             includeToolbar={true}
                             editEnabled={editEnabled}
                             inlineEditing={inlineEditing}
                             deleteEnabled={deleteEnabled}
                             onEntityClick={onEntityClick}
                             additionalColumns={view.additionalColumns}
                             defaultSize={view.defaultSize}
                             paginationEnabled={view.pagination === undefined ? true : view.pagination}
                             initialFilter={view.initialFilter}
                             filterableProperties={view.filterableProperties}
                             properties={view.properties}
                             excludedProperties={view.excludedProperties}
                             onEntityDelete={(collectionPath: string, entity: Entity<any>) =>
                                 view.schema.onDelete && view.schema.onDelete({
                                     schema: view.schema,
                                     collectionPath,
                                     id: entity.id,
                                     entity: entity
                                 })}
                             extraActions={view.extraActions ? view.extraActions(view) : undefined}
                             title={title}
                             createFormField={createFormField}/>

        </div>
    );
}
