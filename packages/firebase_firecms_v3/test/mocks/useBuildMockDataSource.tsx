import {
    DataSource,
    DeleteEntityProps,
    Entity,
    FetchCollectionProps,
    FetchEntityProps,
    ResolvedProperty,
    SaveEntityProps
} from "firecms";

export function useBuildMockDataSource(): DataSource {
    return {
        checkUniqueField(path: string, name: string, value: any, property: ResolvedProperty, entityId?: string): Promise<boolean> {
            return Promise.resolve(false);
        },

        countEntities: (props: FetchCollectionProps<any>): Promise<number> => Promise.resolve(0),

        deleteEntity({
                         entity
                     }: DeleteEntityProps<any>): Promise<void> {
            return Promise.resolve(undefined);
        },

        fetchCollection({
                            path,
                            collection,
                            filter,
                            limit,
                            startAfter,
                            orderBy,
                            order,
                            searchString
                        }: FetchCollectionProps<any>): Promise<Entity<any>[]> {
            return Promise.resolve([]);
        },

        fetchEntity({
                        path,
                        entityId,
                        collection
                    }: FetchEntityProps<any>): Promise<Entity<any> | undefined> {
            return Promise.resolve(undefined);
        },

        generateEntityId(path: string): string {
            return "mock_id_" + Math.floor(Math.random() * 10000);
        },

        saveEntity({
                       path,
                       entityId,
                       values,
                       collection,
                       status
                   }: SaveEntityProps<any>): Promise<Entity<any>> {
            throw new Error("Function not implemented.");
        }
    };
}