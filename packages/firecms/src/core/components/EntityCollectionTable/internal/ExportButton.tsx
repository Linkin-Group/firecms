import React, { useCallback, useEffect, useRef } from "react";

import { Entity, EntityCollection, ExportConfig, ResolvedEntityCollection, User } from "../../../../types";
import { useDataSource, useFireCMSContext, useNavigationContext } from "../../../../hooks";
import { downloadCSV } from "../../../util/csv";
import {
    Alert,
    BooleanSwitchWithLabel,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    IconButton,
    Tooltip,
    Typography
} from "../../../../components";
import { resolveCollection } from "../../../util";
import { GetAppIcon } from "../../../../icons";

interface ExportButtonProps<M extends Record<string, any>, UserType extends User> {
    collection: EntityCollection<M>;
    path: string;
    exportConfig?: ExportConfig<UserType>;
}

const INITIAL_DOCUMENTS_LIMIT = 200;

export function ExportButton<M extends Record<string, any>, UserType extends User>({
                                                                                       collection: inputCollection,
                                                                                       path: inputPath,
                                                                                       exportConfig
                                                                                   }: ExportButtonProps<M, UserType>
) {

    const [flattenArrays, setFlattenArrays] = React.useState<boolean>(false);

    const context = useFireCMSContext<UserType>();
    const dataSource = useDataSource();
    const navigationContext = useNavigationContext();

    const path = navigationContext.resolveAliasesFrom(inputPath);

    const collection: ResolvedEntityCollection<M> = React.useMemo(() => resolveCollection({
        collection: inputCollection,
        path,
        fields: context.fields
    }), [inputCollection, path]);

    const dataRef = useRef<Entity<M>[]>();
    const additionalDataRef = useRef<Record<string, any>[]>();

    const [dataLoading, setDataLoading] = React.useState<boolean>(false);
    const [dataLoadingError, setDataLoadingError] = React.useState<Error | undefined>();

    // If in the initial load, we get more than INITIAL_DOCUMENTS_LIMIT results
    const [hasLargeAmountOfData, setHasLargeAmountOfData] = React.useState<boolean>(false);

    // did the user agree to export a large amount of data
    const [fetchLargeDataAccepted, setFetchLargeDataAccepted] = React.useState<boolean>(false);

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = useCallback(() => {
        setOpen(true);
    }, [setOpen]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const doDownload = useCallback((data: Entity<M>[] | undefined,
                                    additionalData: Record<string, any>[] | undefined,
                                    collection: ResolvedEntityCollection<M>,
                                    exportConfig: ExportConfig<any> | undefined) => {
        if (!data)
            throw Error("Trying to perform export without loading data first");

        downloadCSV(data, additionalData, collection, flattenArrays, exportConfig);
    }, [flattenArrays]);

    const fetchAdditionalFields = useCallback(async (entities: Entity<M>[]) => {

        if (!exportConfig?.additionalFields) {
            return;
        }

        const additionalFields = exportConfig.additionalFields;

        const resolvedColumnsValues: Record<string, any>[] = await Promise.all(entities.map(async (entity) => {
            return (await Promise.all(additionalFields.map(async (column) => {
                return {
                    [column.key]: await column.builder({
                        entity,
                        context
                    })
                };
            }))).reduce((a, b) => ({ ...a, ...b }), {});
        }));
        return resolvedColumnsValues;
    }, [exportConfig?.additionalFields]);

    const updateEntities = useCallback(async (entities: Entity<M>[]) => {
        if (entities.length >= INITIAL_DOCUMENTS_LIMIT) {
            setHasLargeAmountOfData(true);
        }

        const pendingDownload = dataRef.current && entities.length > dataRef.current.length && fetchLargeDataAccepted;

        dataRef.current = entities;
        const additionalFieldsData = await fetchAdditionalFields(entities);
        additionalDataRef.current = additionalFieldsData;
        setDataLoadingError(undefined);

        if (pendingDownload) {
            doDownload(entities, additionalFieldsData, collection, exportConfig);
            handleClose();
        }
    }, [collection, doDownload, exportConfig, fetchAdditionalFields, fetchLargeDataAccepted, handleClose, path]);

    useEffect(() => {

        if (!open) return;

        setDataLoading(true);
        dataSource.fetchCollection<M>({
            path,
            collection,
            limit: fetchLargeDataAccepted ? undefined : INITIAL_DOCUMENTS_LIMIT
        })
            .then(updateEntities)
            .catch(setDataLoadingError)
            .finally(() => setDataLoading(false));

    }, [collection, dataSource, fetchLargeDataAccepted, open, path, updateEntities]);

    const needsToAcceptFetchAllData = hasLargeAmountOfData && !fetchLargeDataAccepted;

    const onOkClicked = useCallback(() => {
        if (needsToAcceptFetchAllData) {
            setFetchLargeDataAccepted(true);
        } else {
            doDownload(dataRef.current, additionalDataRef.current, collection, exportConfig);
            handleClose();
        }
    }, [needsToAcceptFetchAllData, doDownload, collection, path, exportConfig, handleClose]);

    return <>

        <Tooltip title={"Export"}>
            <IconButton color={"primary"} onClick={handleClickOpen}>
                <GetAppIcon/>
            </IconButton>
        </Tooltip>

        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogContent className={"flex flex-col gap-4 my-4"}>

                <Typography variant={"h6"}>Export data</Typography>

                <div>Download the the content of this table as a CSV</div>

                {needsToAcceptFetchAllData &&
                    <Alert color={"warning"}>
                        <div>
                            This collections has a large number
                            of documents (more
                            than {INITIAL_DOCUMENTS_LIMIT}).
                        </div>
                        <div>
                            Would you like to proceed?
                        </div>

                    </Alert>}

                <BooleanSwitchWithLabel
                    size={"small"}
                    value={flattenArrays}
                    onValueChange={setFlattenArrays}
                    label={"Flatten arrays"}/>

            </DialogContent>

            <DialogActions>

                {dataLoading && <CircularProgress size={"small"}/>}

                <Button onClick={handleClose} variant={"text"}>
                    Cancel
                </Button>

                <Button variant="filled"
                        disabled={dataLoading}
                        onClick={onOkClicked}>
                    Download
                </Button>

            </DialogActions>

        </Dialog>

    </>;
}