import React, { useCallback, useEffect, useState } from "react";

import { useFireCMSContext, useNavigationContext } from "../../../hooks";
import { PluginGenericProps, PluginHomePageAdditionalCardsProps } from "../../../types";

import { toArray } from "../../util/arrays";
import { NavigationGroup } from "./NavigationGroup";
import { NavigationCollectionCard } from "./NavigationCollectionCard";

// @ts-ignore
import * as JsSearch from "js-search";

import { SearchBar } from "../EntityCollectionTable/internal/SearchBar";
import { FavouritesView } from "./FavouritesView";
import { useRestoreScroll } from "../../internal/useRestoreScroll";
import { Container } from "../../../components";

const search = new JsSearch.Search("home");
search.addIndex("name");
search.addIndex("description");
search.addIndex("group");
search.addIndex("path");

/**
 * Default entry view for the CMS. This component renders navigation cards
 * for each collection defined in the navigation.
 * @constructor
 * @category Components
 */
export function FireCMSHomePage({
                                    additionalChildrenStart,
                                    additionalChildrenEnd
                                }: {
    additionalChildrenStart?: React.ReactNode, additionalChildrenEnd?: React.ReactNode
}) {

    const context = useFireCMSContext();
    const navigationContext = useNavigationContext();

    if (!navigationContext.topLevelNavigation)
        throw Error("Navigation not ready in FireCMSHomePage");

    const {
        containerRef,
        scroll,
        direction
    } = useRestoreScroll();

    const {
        navigationEntries,
        groups
    } = navigationContext.topLevelNavigation;

    const [filteredUrls, setFilteredUrls] = useState<string[] | null>(null);

    const filteredNavigationEntries = filteredUrls
        ? navigationEntries.filter((entry) => filteredUrls.includes(entry.url))
        : navigationEntries;

    useEffect(() => {
        search.addDocuments(filteredNavigationEntries);
    }, [navigationEntries]);

    const updateSearchResults = useCallback(
        (value?: string) => {
            if (!value || value === "") {
                setFilteredUrls(null);
            } else {
                setFilteredUrls(search.search(value).map((e: any) => e.url));
            }
        }, []);

    const allGroups: Array<string | undefined> = [...groups];
    if (filteredNavigationEntries.filter(e => !e.group).length > 0 || filteredNavigationEntries.length === 0) {
        allGroups.push(undefined);
    }

    let additionalSections: React.ReactNode | undefined;
    if (context.plugins) {
        const sectionProps: PluginGenericProps = {
            context
        };
        additionalSections = <>
            {context.plugins.filter(plugin => plugin.homePage?.includeSection)
                .map((plugin, i) => {
                    const section = plugin.homePage!.includeSection!(sectionProps)
                    return (
                        <NavigationGroup
                            group={section.title}
                            key={`plugin_section_${plugin.name}`}>
                            {section.children}
                        </NavigationGroup>
                    );
                })}
        </>
        ;
    }

    return (
        <div ref={containerRef}
             className="py-2 overflow-auto h-full w-full">
            <Container>

                <div
                    className="sticky py-4 transition-top duration-400 ease-in-out top-0 z-10"
                    style={{ top: direction === "down" ? -84 : 0 }}>
                    <SearchBar onTextSearch={updateSearchResults}
                               placeholder={"Search collections"}
                               large={false}
                               className={"w-full"}/>
                </div>

                <FavouritesView hidden={Boolean(filteredUrls)}/>

                {additionalChildrenStart}

                {allGroups.map((group, index) => {

                    const AdditionalCards: React.ComponentType<PluginHomePageAdditionalCardsProps>[] = [];
                    const actionProps: PluginHomePageAdditionalCardsProps = {
                        group,
                        context
                    };

                    if (context.plugins) {
                        context.plugins.forEach(plugin => {
                            if (plugin.homePage?.AdditionalCards) {
                                AdditionalCards.push(...toArray(plugin.homePage?.AdditionalCards));
                            }
                        });
                    }

                    const thisGroupCollections = filteredNavigationEntries
                        .filter((entry) => entry.group === group || (!entry.group && group === undefined));
                    if (thisGroupCollections.length === 0 && AdditionalCards.length === 0)
                        return null;
                    return (
                        <NavigationGroup
                            group={group}
                            key={`plugin_section_${group}`}>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {thisGroupCollections.map((entry) => (
                                    <div key={`nav_${entry.group}_${entry.name}`} className="col-span-1">
                                        <NavigationCollectionCard
                                            {...entry}
                                            onClick={() => {
                                                const event =
                                                    entry.type === "collection"
                                                        ? "home_navigate_to_collection"
                                                        : entry.type === "view"
                                                            ? "home_navigate_to_view"
                                                            : "unmapped_event";
                                                context.onAnalyticsEvent?.(event, { path: entry.path });
                                            }}
                                        />
                                    </div>
                                ))}
                                {AdditionalCards &&
                                    AdditionalCards.map((AdditionalCard, i) => (
                                        <div key={`nav_${group}_add_${i}`}>
                                            <AdditionalCard {...actionProps} />
                                        </div>
                                    ))}
                            </div>
                        </NavigationGroup>
                    );
                })}

                {additionalSections}

                {additionalChildrenEnd}

            </Container>
        </div>
    );
}
